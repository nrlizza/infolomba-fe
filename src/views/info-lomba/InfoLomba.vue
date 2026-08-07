<script setup>
import Card from "@/components/Ui/Card.vue";
import FwbCard from "@/components/Ui/FwbCard.vue";
import { useAllKategori, useAllLomba, useAllPendidikan, useAllProvinsi, useAllJenis, useAllPembayaran } from "@/composables/tanstack-query/useQuery";
import { FwbButton, FwbPagination, FwbSelect } from 'flowbite-vue'
import { ref, computed } from 'vue'

const { data: tingkatPendidikan, isLoading: isLoadingPendidikan } = useAllPendidikan();
const { data: kategoriLomba, isLoading: isLoadingKategori } = useAllKategori();
const { data: provinsi, isLoading: isLoadingProvinsi } = useAllProvinsi();
const { data: jenisLomba, isLoading: isLoadingJenis } = useAllJenis();
const { data: pembayaran, isLoading: isLoadingPembayaran } = useAllPembayaran();

const currentPage = ref(1);
const itemsPerPage = 9; // Jumlah item per halaman

// Filter states
const selectedKategori = ref("");
const selectedTingkat = ref("");
const selectedProvinsi = ref("");
const selectedJenis = ref("");
const selectedPembayaran = ref("");

// Filter parameters untuk API - digunakan saat tombol Cari diklik
const activeFilters = ref({});

// Computed filter params yang digunakan untuk query
const filterParams = computed(() => activeFilters.value);

const { data: lomba, isLoading: isLoadingLomba } = useAllLomba(currentPage, itemsPerPage, filterParams);

// Function untuk handle search
const handleSearch = () => {
  // Reset ke halaman pertama saat search
  currentPage.value = 1;
  
  // Build filter params
  const params = {};
  if (selectedKategori.value) params.kategori = selectedKategori.value;
  if (selectedTingkat.value) params.tingkat = selectedTingkat.value;
  if (selectedProvinsi.value) params.provinsi = selectedProvinsi.value;
  if (selectedJenis.value) params.jenis = selectedJenis.value;
  if (selectedPembayaran.value) params.pembayaran = selectedPembayaran.value;
  
  // Update active filters akan trigger query secara otomatis
  activeFilters.value = { ...params };
};

</script>

<template>
  <div class="info-page min-h-full bg-slate-50/50">
    <!-- HERO SECTION (COMPACT) -->
    <div class="relative bg-white border-b border-gray-100 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-blue-50/30"></div>
      <div class="max-w-7xl mx-auto px-6 pt-4 pb-8 md:pt-6 md:pb-10 relative z-10 text-center">
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-1">
          INFO <span class="text-indigo-600">LOMBA</span>
        </h1>
        <p class="text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Temukan kompetisi terbaik dan raih prestasimu.
        </p>
      </div>
    </div>

    <!-- FILTER SECTION (COMPACT) -->
    <div class="max-w-7xl mx-auto px-6 -mt-6 relative z-20">
      <div class="bg-white rounded-xl shadow-lg shadow-indigo-100/40 border border-gray-100 p-4 md:p-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
          
          <!-- Kategori Lomba -->
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Kategori</label>
            <FwbSelect v-model="selectedKategori" placeholder="Semua" size="sm" :options="kategoriLomba?.data" class="modern-select" />
          </div>

          <!-- Tingkat Peserta -->
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tingkat</label>
            <FwbSelect v-model="selectedTingkat" placeholder="Semua" size="sm" :options="tingkatPendidikan?.data" class="modern-select" />
          </div>

          <!-- Area Kompetisi -->
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Provinsi</label>
            <FwbSelect v-model="selectedProvinsi" placeholder="Semua" size="sm" :options="provinsi?.data" class="modern-select" />
          </div>

          <!-- Jenis Lomba -->
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Jenis</label>
            <FwbSelect v-model="selectedJenis" placeholder="Semua" size="sm" :options="jenisLomba?.data" class="modern-select" />
          </div>

          <!-- Registrasi -->
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Biaya</label>
            <FwbSelect v-model="selectedPembayaran" placeholder="Semua" size="sm" :options="pembayaran?.data" class="modern-select" />
          </div>

          <!-- Button Cari -->
          <div>
            <button 
              @click="handleSearch" 
              class="w-full h-[38px] bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- MAIN CONTENT (COMPACT) -->
    <div class="max-w-7xl mx-auto px-6 pt-6 pb-8">
      
      <!-- Loading State -->
      <div v-if="isLoadingLomba" class="flex flex-col items-center justify-center py-12 space-y-4">
        <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="text-sm text-slate-500 font-medium">Memuat lomba...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!lomba?.data || lomba.data.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
        <div class="bg-slate-100 p-5 rounded-full mb-4">
          <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-1">Tidak ditemukan</h3>
        <p class="text-sm text-slate-500">Coba ubah filter pencarianmu.</p>
      </div>

      <!-- Data Display -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FwbCard v-for="data in lomba?.data" :key="data.id_lomba" :lomba="data" />
        </div>

        <!-- Pagination -->
        <div v-if="lomba?.pagination?.totalPages > 1" class="flex justify-center mt-8">
          <fwb-pagination 
            v-model="currentPage" 
            :total-pages="lomba?.pagination?.totalPages || 1" 
            hide-labels 
            show-icons 
            class="pagination-custom"
          />
        </div>
      </div>
    </div>

  </div>
</template>
