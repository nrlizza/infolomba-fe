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
    <FwbCard class="w-md relative overflow-hidden group">
        <div class="flex h-full relative">
            <!-- PITA FAVORIT -->
            <button @click="handleToggleFavorite" 
                    class="absolute -top-1 right-3 z-10 w-7 h-10 flex items-start justify-center transition-transform transform hover:scale-105 hover:-translate-y-1 drop-shadow-md">
                <!-- SVG Hollow (Belum Favorit) -->
                <svg v-if="!isFavorited" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-10 text-gray-800 drop-shadow">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                <!-- SVG Solid Hitam (Sudah Favorit) -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-10 text-black drop-shadow-lg">
                    <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                </svg>
            </button>

            <!-- GAMBAR KIRI -->
            <img :src="lomba.image_url" alt="poster lomba" class="w-45 h-58 object-cover rounded-l-lg" />

            <!-- KONTEN KANAN -->
            <div class="flex-1 px-6 py-3">
                <!-- Judul -->
                <h2 class="font-semibold text-[16px] text-[#4954DE] leading-tight -ml-1 text-left">
                    {{ lomba.nama_lomba }}
                </h2>

                <!-- Detail Info -->
                <div class="mt-4 space-y-2 text-[14px]">
                    <!-- Kategori -->
                    <div class="flex items-center gap-3">
                        <!-- SVG ASLI -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                        </svg>
                        <p>{{ lomba.kategori_lomba }}</p>
                    </div>

                    <!-- Tanggal -->
                    <div class="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        <p>
                            {{ new Date(lomba.tanggal_lomba).toLocaleDateString('id-ID') }}
                            <span v-if="lomba.tanggal_batas_pendaftaran">
                                - {{ new Date(lomba.tanggal_batas_pendaftaran).toLocaleDateString('id-ID') }}
                            </span>
                        </p>
                    </div>

                    <!-- Peserta -->
                    <div class="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                        <p>{{ lomba.tingkat_pendidikan }}</p>
                    </div>

                    <!-- Pembayaran (static dulu) -->
                    <div class="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                        </svg>

                        <!-- GRATIS -->
                        <span v-if="lomba.harga === 0"
                            class="px-2 py-0.5 rounded-md bg-green-100 text-green-700 font-semibold text-xs">
                            GRATIS
                        </span>

                        <!-- BERBAYAR -->
                        <p v-else class="font-medium text-gray-800">
                            {{ formatRupiah(lomba.harga) }}
                        </p>
                    </div>
                </div>

                <div class="mt-5 ml-0 flex items-center gap-4">
                    <FwbButton class="w-full" @click="handleDetail(lomba)">
                        📑DETAIL LOMBA
                    </FwbButton>
                </div>
            </div>
        </div>
    </FwbCard>
</template>
