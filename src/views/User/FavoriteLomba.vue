<script setup>
import { useQuery } from '@tanstack/vue-query'
import AxiosInstance from '@/lib/axios/axiosInstance'
import FwbCard from '@/components/Ui/FwbCard.vue'
import HeroFavorit from '@/assets/HeroFavorit.png'
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
    <div>
        <!-- =================== HERO SECTION =================== -->
        <section
            class="overflow-hidden"
            style="background: linear-gradient(135deg, #5B4FD4 0%, #7B5EE8 50%, #8B6FF0 100%); position: relative; z-index: 0; min-height: 400px;"
        >
            <!-- Dekorasi lingkaran -->
            <div class="absolute -top-12 -left-12 w-48 h-48 rounded-full opacity-20" style="background:#ffffff;"></div>
            <div class="absolute -bottom-16 left-1/3 w-64 h-64 rounded-full opacity-10" style="background:#ffffff;"></div>

            <div class="relative container mx-auto px-8 lg:px-16 py-10 flex items-center justify-between gap-10">
                <!-- Kiri: Breadcrumb + Judul + Deskripsi -->
                <div class="flex-1 text-white pt-6"">
                    
                    <!-- Judul -->
                    <h1 class="text-5xl lg:text-6xl  font-extrabold leading-tight mb-5">
                        Lomba<br />
                        <span style="color: #FFD277;">Favoritmu</span>
                    </h1>

                    <!-- Deskripsi -->
                    <p class="text-blue-100 text-lg leading-relaxed max-w-lg">
                        Pantau dan kelola semua kompetisi yang telah kamu simpan. Jangan lewatkan kesempatan untuk berprestasi!
                    </p>
                </div>

                <!-- Kanan: Gambar kecil di dalam kotak -->
              <div class="flex-shrink-0">
                <div class="rounded-2xl overflow-hidden shadow-2xl" style="width: 300px; height: 210px;">
                    <img
                        :src="HeroFavorit"
                        alt="Lomba Favoritmu"
                        class="w-full h-full object-cover"
                    />
                </div>
            </div>
            </div>
        </section>

        <!-- =================== KOLEKSI TERSIMPAN =================== -->
        <div class="container mx-auto px-8 lg:px-16 py-10">
            <h2 class="text-2xl font-bold text-gray-800 mb-1">Koleksi Tersimpan</h2>
            <p v-if="lombas && lombas.length > 0" class="text-lg text-gray-500 mb-8">
                Menampilkan <span class="font-semibold text-indigo-600">{{ lombas.length }}</span> lomba yang baru saja kamu simpan ke dalam daftar favorit.
            </p>
            <div v-else class="mb-6"></div>

            <!-- Loading -->
            <div v-if="isLoading" class="flex justify-center items-center h-48">
                <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>

            <!-- Error -->
            <div v-else-if="isError" class="text-center text-red-500 py-10 bg-white rounded-lg border border-red-100">
                <p>Gagal memuat daftar favorit. Silakan coba lagi.</p>
            </div>

            <!-- Kosong -->
            <div v-else-if="!lombas || lombas.length === 0"
                class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-16 h-16 text-gray-300 mb-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                <p class="text-gray-500 font-semibold text-lg">Belum ada lomba yang disimpan.</p>
                <p class="text-gray-400 text-sm mt-1">Klik ikon pita pada kartu lomba untuk menyimpannya ke sini.</p>
                <button @click="router.push('/info-lomba')"
                    class="mt-6 px-6 py-2.5 rounded-full text-white font-semibold text-sm transition hover:opacity-90"
                    style="background: linear-gradient(135deg, #4657B5, #6C4DDF);">
                    🔍 Cari Lomba Sekarang
                </button>
            </div>

            <!-- Daftar Kartu -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FwbCard v-for="lomba in lombas" :key="lomba.id_lomba" :lomba="lomba" />
            </div>
        </div>
    </div>
</template>
