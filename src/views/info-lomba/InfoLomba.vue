<script setup>
import Card from "@/components/Ui/Card.vue";
import FwbCard from "@/components/Ui/FwbCard.vue";
import { useAllKategori, useAllLomba, useAllPendidikan, useAllProvinsi } from "@/composables/tanstack-query/useQuery";
import { FwbButton, FwbPagination, FwbSelect } from 'flowbite-vue'
import { ref } from 'vue'

const { data: tingkatPendidikan, isLoading: isLoadingPendidikan } = useAllPendidikan();
const { data: kategoriLomba, isLoading: isLoadingKategori } = useAllKategori();
const { data: provinsi, isLoading: isLoadingProvinsi } = useAllProvinsi();
const { data: lomba, isLoading: isLoadingLomba } = useAllLomba();

const currentPage = ref(1);

</script>

<template>
  <div class="info-page min-h-screen bg-white px-6">
    <!-- FILTER BAR -->
    <div class="flex flex-wrap gap-5 justify-start max-w-7xl mx-auto py-15 px-4">

      <!-- Kategori Lomba -->
      <div class="flex-1 min-w-[150px]">
        <FwbSelect label="Kategori Lomba" placeholder="Semua Kategori" size="md" :options="kategoriLomba?.data"
          class="custom-bg" />
      </div>

      <!-- Tingkat Peserta -->
      <div class="flex-1 min-w-[150px]">
        <FwbSelect label="Tingkat Peserta" placeholder="Semua Tingkat" size="md" :options="tingkatPendidikan?.data"
          class="custom-bg" />
      </div>

      <!-- Area Kompetisi -->
      <div class="flex-1 min-w-[150px]">
        <FwbSelect label="Area Kompetisi" placeholder="Semua Area" size="md" :options="provinsi?.data" class="custom-bg" />
      </div>

      <!-- Jenis Lomba -->
      <div class="flex-1 min-w-[150px]">
        <FwbSelect label="Jenis Lomba" placeholder="Semua Jenis" size="md" :options="tingkatPendidikan?.data" class="custom-bg" />
      </div>

      <!-- Registrasi -->
      <div class="flex-1 min-w-[150px]">
        <FwbSelect label="Registrasi" placeholder="Semua Registrasi" size="md" :options="tingkatPendidikan?.data"
          class="custom-bg" />
      </div>

      <!-- Button Cari -->
      <div class="flex-1 min-w-[150px] flex items-end">
        <FwbButton size="md" class="w-full h-11 flex items-center justify-center">
          Cari
        </FwbButton>
      </div>

    </div>

    <!-- TITLE -->
    <section class="text-center mb-15">
      <h2 class="text-3xl lg:text-4xl font-extrabold text-[#4954DE] tracking-wide">
        Info Lomba
      </h2>
    </section>

    <!-- CARD GRID -->
    <div class="container mx-auto lg:px-15 pb-20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        <FwbCard v-for="data in lomba?.data" :key="data.nama_lomba" :lomba="data" />
      </div>

      <div class="flex justify-center mt-25">
        <fwb-pagination v-model="currentPage" :total-pages="10" hide-labels show-icons large />
      </div>
    </div>

  </div>
</template>

<style>
.info-page {
  background: #ffffff !important;
}
</style>
