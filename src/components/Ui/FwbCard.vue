<script setup>
import { ref, computed } from 'vue'
import { FwbButton, FwbCard } from 'flowbite-vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import AxiosInstance from '@/lib/axios/axiosInstance'
import cookie from 'vue-cookies'

const router = useRouter()
const queryClient = useQueryClient()
const token = cookie.get('token')

const props = defineProps({
    lomba: {
        type: Object,
        required: true
    }
})

const { data: favoriteIds } = useQuery({
    queryKey: ['favoriteIds'],
    queryFn: async () => {
        if (!token) return []
        const res = await AxiosInstance.get('/favorite/ids')
        return res.data.data
    },
    enabled: !!token
})

const isFavorited = computed(() => {
    return favoriteIds.value?.includes(props.lomba.id_lomba) || false
})

const toggleFavoriteMutation = useMutation({
    mutationFn: async (id_lomba) => {
        const res = await AxiosInstance.post('/favorite/toggle', { id_lomba })
        return res.data
    },
    onMutate: async (id_lomba) => {
        // Optimistic update
        await queryClient.cancelQueries({ queryKey: ['favoriteIds'] })
        const previousFavorites = queryClient.getQueryData(['favoriteIds'])
        
        queryClient.setQueryData(['favoriteIds'], (old) => {
            if (!old) return [id_lomba]
            return old.includes(id_lomba) 
                ? old.filter(id => id !== id_lomba)
                : [...old, id_lomba]
        })
        
        return { previousFavorites }
    },
    onError: (err, id_lomba, context) => {
        queryClient.setQueryData(['favoriteIds'], context.previousFavorites)
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['favoriteIds'] })
        queryClient.invalidateQueries({ queryKey: ['favoriteLombas'] })
    }
})

const handleToggleFavorite = () => {
    if (!token) {
        router.push('/login')
        return
    }
    toggleFavoriteMutation.mutate(props.lomba.id_lomba)
}

const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(value)
}

const handleDetail = (lomba) => {
    router.push('/detail-lomba/' + lomba.id_lomba)
}

</script>

<template>
    <div class="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden flex">
        <!-- GAMBAR KIRI -->
        <div class="relative w-[140px] flex-shrink-0 overflow-hidden">
            <img :src="lomba.image_url" alt="poster lomba" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            
            <!-- FAVORITE BUTTON -->
            <button @click.stop="handleToggleFavorite" 
                    class="absolute top-2 right-2 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all transform hover:scale-110 active:scale-95">
                <svg v-if="!isFavorited" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-red-500">
                    <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>

        <!-- KONTEN KANAN -->
        <div class="flex-1 p-4 flex flex-col min-w-0">
            <!-- JUDUL -->
            <h2 class="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-3 group-hover:text-[#4954DE] transition-colors">
                {{ lomba.nama_lomba }}
            </h2>

            <!-- INFO -->
            <div class="space-y-2 mb-3 flex-grow">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-[#4954DE]/10 flex items-center justify-center flex-shrink-0">
                        <svg class="w-3 h-3 text-[#4954DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <span class="text-xs text-gray-600 truncate">{{ lomba.kategori_lomba }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-[#4954DE]/10 flex items-center justify-center flex-shrink-0">
                        <svg class="w-3 h-3 text-[#4954DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span class="text-xs text-gray-600">{{ new Date(lomba.tanggal_lomba).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-[#4954DE]/10 flex items-center justify-center flex-shrink-0">
                        <svg class="w-3 h-3 text-[#4954DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-9-3.824" />
                        </svg>
                    </div>
                    <span class="text-xs text-gray-600 truncate">{{ lomba.tingkat_pendidikan }}</span>
                </div>
            </div>

            <!-- FOOTER -->
            <div class="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <div class="flex flex-col min-w-0">
                    <span v-if="lomba.harga === 0" class="text-green-600 font-bold text-sm">GRATIS</span>
                    <span v-else class="text-[#4954DE] font-bold text-sm truncate">{{ formatRupiah(lomba.harga) }}</span>
                </div>
                <button @click="handleDetail(lomba)" 
                        class="px-4 py-2 bg-[#4954DE] text-white text-xs font-bold rounded-lg hover:bg-[#3641f5] shadow-sm hover:shadow-md transition-all active:scale-95 flex-shrink-0">
                    Detail
                </button>
            </div>
        </div>
    </div>
</template>
