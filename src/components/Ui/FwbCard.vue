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
    <div class="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#4954DE]/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex h-full">
        <div class="relative w-[160px] flex-shrink-0 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-[#4954DE]/5 to-transparent z-[1]"></div>
            <img :src="lomba.image_url" alt="poster lomba" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-[2]"></div>
            
            <button @click.stop="handleToggleFavorite" 
                    :class="[
                        'absolute top-3 right-3 z-10 p-2 rounded-full shadow-lg transition-all duration-200',
                        isFavorited 
                            ? 'bg-red-50 hover:bg-red-100 scale-100' 
                            : 'bg-white/95 backdrop-blur-sm hover:bg-white hover:scale-110'
                    ]">
                <svg v-if="!isFavorited" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-red-500 animate-pulse">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
            </button>

            <div v-if="lomba.harga === 0" class="absolute bottom-3 left-3 z-10">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    GRATIS
                </span>
            </div>
        </div>

        <div class="flex-1 p-5 flex flex-col min-w-0">
            <h2 class="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-4 group-hover:text-[#4954DE] transition-colors duration-200">
                {{ lomba.nama_lomba }}
            </h2>

            <div class="space-y-2.5 mb-4 flex-grow">
                <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4954DE]/10 to-[#4954DE]/5 flex items-center justify-center flex-shrink-0 group-hover:from-[#4954DE]/20 group-hover:to-[#4954DE]/10 transition-all">
                        <svg class="w-3.5 h-3.5 text-[#4954DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <span class="text-sm text-gray-700 truncate font-medium">{{ lomba.kategori_lomba }}</span>
                </div>
                <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4954DE]/10 to-[#4954DE]/5 flex items-center justify-center flex-shrink-0 group-hover:from-[#4954DE]/20 group-hover:to-[#4954DE]/10 transition-all">
                        <svg class="w-3.5 h-3.5 text-[#4954DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span class="text-sm text-gray-700 font-medium">{{ new Date(lomba.tanggal_lomba).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
                </div>
                <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4954DE]/10 to-[#4954DE]/5 flex items-center justify-center flex-shrink-0 group-hover:from-[#4954DE]/20 group-hover:to-[#4954DE]/10 transition-all">
                        <svg class="w-3.5 h-3.5 text-[#4954DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-9-3.824" />
                        </svg>
                    </div>
                    <span class="text-sm text-gray-700 truncate font-medium">{{ lomba.tingkat_pendidikan }}</span>
                </div>
            </div>

            <div class="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <div class="flex flex-col min-w-0">
                    <span v-if="lomba.harga === 0" class="text-emerald-600 font-bold text-base">GRATIS</span>
                    <div v-else>
                        <span class="text-xs text-gray-500 font-medium">Biaya</span>
                        <p class="text-[#4954DE] font-bold text-base truncate">{{ formatRupiah(lomba.harga) }}</p>
                    </div>
                </div>
                <button @click="handleDetail(lomba)" 
                        class="group/btn relative px-5 py-2.5 bg-gradient-to-r from-[#4954DE] to-[#5B4FD4] text-white text-sm font-semibold rounded-xl hover:from-[#3641f5] hover:to-[#4a3ec3] shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0">
                    <span class="relative z-10 flex items-center gap-1.5">
                        Detail
                        <svg class="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>
