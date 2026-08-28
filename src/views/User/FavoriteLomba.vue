<script setup>
import { useQuery } from '@tanstack/vue-query'
import AxiosInstance from '@/lib/axios/axiosInstance'
import FwbCard from '@/components/Ui/FwbCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { data: lombas, isLoading, isError } = useQuery({
    queryKey: ['favoriteLombas'],
    queryFn: async () => {
        const res = await AxiosInstance.get('/favorite')
        return res.data.data
    }
})
</script>

<template>
    <div class="min-h-screen bg-slate-50/50">
        <div class="relative bg-white border-b border-gray-100 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-blue-50/30"></div>
            <div class="max-w-7xl mx-auto px-6 pt-6 pb-10 relative z-10 text-center">
                <h1 class="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">
                    SIMPAN <span class="text-indigo-600">FAVORIT</span>
                </h1>
                <p class="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Pantau dan kelola semua kompetisi yang telah kamu simpan. Jangan lewatkan kesempatan untuk berprestasi!
                </p>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-6 py-8">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Koleksi Tersimpan</h2>
                <p v-if="lombas && lombas.length > 0" class="text-base text-gray-600">
                    Menampilkan <span class="font-bold text-[#4954DE]">{{ lombas.length }}</span> lomba favorit
                </p>
            </div>

            <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
                <div class="relative">
                    <div class="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                    <div class="absolute top-0 left-0 w-16 h-16 border-4 border-[#4954DE] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p class="mt-4 text-gray-500 font-medium">Memuat favorit...</p>
            </div>

            <div v-else-if="isError" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-red-700 font-semibold">Gagal memuat daftar favorit</p>
                <p class="text-red-600 text-sm mt-1">Silakan coba lagi dalam beberapa saat</p>
            </div>

            <div v-else-if="!lombas || lombas.length === 0" class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="flex flex-col items-center justify-center py-20 px-6">
                    <div class="relative mb-6">
                        <div class="absolute inset-0 bg-gray-100 rounded-full blur-xl"></div>
                        <div class="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                            <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Belum Ada Lomba Favorit</h3>
                    <p class="text-gray-500 text-center max-w-md mb-6">
                        Klik ikon hati pada kartu lomba untuk menyimpannya sebagai favorit dan aksesnya dengan mudah di sini.
                    </p>
                    <button @click="router.push('/info-lomba')" class="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4954DE] to-[#5B4FD4] text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Cari Lomba Sekarang</span>
                    </button>
                </div>
            </div>

            <div v-else class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                <FwbCard v-for="lomba in lombas" :key="lomba.id_lomba" :lomba="lomba" />
            </div>
        </div>
    </div>
</template>
