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
  <div class="info-page min-h-screen bg-white px-6">
    <!-- FILTER BAR -->
    <div class="flex flex-wrap gap-5 justify-start max-w-7xl mx-auto py-15 px-4">

      <!-- Kategori Lomba -->
      <div class="flex-1 min-w-[150px]">
        <FwbSelect v-model="selectedKategori" label="Kategori Lomba" placeholder="Semua Kategori" size="md" :options="kategoriLomba?.data"
          class="custom-bg" />
      </div>

      <!-- Tingkat Peserta -->
      <div class="flex-1 min-w-[150px]">
        <FwbSelect v-model="selectedTingkat" label="Tingkat Peserta" placeholder="Semua Tingkat" size="md" :options="tingkatPendidikan?.data"
          class="custom-bg" />
      </div>

      <!-- Area Kompetisi -->
      <div class="flex-1 min-w-[150px]">
        <FwbSelect v-model="selectedProvinsi" label="Area Kompetisi" placeholder="Semua Area" size="md" :options="provinsi?.data" class="custom-bg" />
      </div>

      <!-- Jenis Lomba -->
      <div class="flex-1 min-w-[150px]">
        <FwbSelect v-model="selectedJenis" label="Jenis Lomba" placeholder="Semua Jenis" size="md" :options="jenisLomba?.data" class="custom-bg" />
      </div>

      <!-- Registrasi -->
      <div class="flex-1 min-w-[150px]">
        <FwbSelect v-model="selectedPembayaran" label="Registrasi" placeholder="Semua Registrasi" size="md" :options="pembayaran?.data"
          class="custom-bg" />
      </div>

      <!-- Button Cari -->
      <div class="flex-1 min-w-[150px] flex items-end">
        <FwbButton @click="handleSearch" size="md" class="w-full h-11 flex items-center justify-center">
          Cari
        </FwbButton>
      </div>

    </div>

    <!-- TITLE -->
    <section class="text-center mb-15">
      <h2 class="text-3xl lg:text-4xl font-extrabold text-[#4954DE] tracking-wide">
        INFO LOMBA
      </h2>
      
      <p class="text-base lg:text-lg text-[#4954DE] mt-2">
        Jelajahi semua lomba yang tersedia dan filter sesuai kebutuhanmu!
      </p>
    </section>

    <!-- CARD GRID -->
    <div class="container mx-auto lg:px-15 pb-20">
      <!-- Loading State -->
      <div v-if="isLoadingLomba" class="text-center py-20">
        <p class="text-gray-500 text-lg">Loading...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!lomba?.data || lomba.data.length === 0" class="text-center py-20">
        <p class="text-gray-500 text-lg">Tidak ada lomba yang tersedia</p>
      </div>

      <!-- Data Display -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
          <FwbCard v-for="data in lomba?.data" :key="data.nama_lomba" :lomba="data" />
        </div>

        <!-- Pagination -->
        <div v-if="lomba?.pagination?.totalPages > 1" class="flex justify-center mt-25">
          <fwb-pagination 
            v-model="currentPage" 
            :total-pages="lomba?.pagination?.totalPages || 1" 
            hide-labels 
            show-icons 
            large 
          />
        </div>
      </div>
    </div>

  </div>
</template>

<style>
.info-page {
  background: #ffffff !important;
}
</style>
