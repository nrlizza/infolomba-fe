<script setup>
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
} from 'flowbite-vue'
</script>

<template>
  <div class="p-6 md:p-8 max-w-7xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-2">Daftar Peserta Lomba</h2>
    <p class="text-gray-600 mb-6">Kelola dan pantau peserta lomba yang telah mendaftar</p>
    
    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <fwb-table class="min-w-full border border-blue-600">
  <fwb-table-head>
    <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">Nama Lengkap</fwb-table-head-cell>
    <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">Email</fwb-table-head-cell>
    <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">Tanggal Lahir</fwb-table-head-cell>
    <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">No. Telepon</fwb-table-head-cell>
    <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">Tingkat Pendidikan</fwb-table-head-cell>
    <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">Nama Instansi</fwb-table-head-cell>
  </fwb-table-head>

  <fwb-table-body>
    <fwb-table-row class="bg-[#6A73E6] hover:bg-[#5a63d8] text-black">
      <fwb-table-cell class="px-4 py-3 text-black border border-blue-300">Abdul Dudul</fwb-table-cell>
      <fwb-table-cell class="px-4 py-3 text-black border border-blue-300">Abduldu12@gmail.com</fwb-table-cell>
      <fwb-table-cell class="px-4 py-3 text-black border border-blue-300">31-07-2004</fwb-table-cell>
      <fwb-table-cell class="px-4 py-3 text-black border border-blue-300">08127237490</fwb-table-cell>
      <fwb-table-cell class="px-4 py-3 border border-blue-300">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-black">
          SMK
        </span>
      </fwb-table-cell>
      <fwb-table-cell class="px-4 py-3 text-black border border-blue-300">SMK Teknologi Bandung</fwb-table-cell>
    </fwb-table-row>
  </fwb-table-body>
</fwb-table>

    </div>
    
    <!-- Informasi tambahan -->
    <div class="mt-6 p-2 bg-gray-50 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
        <p class="text-sm text-gray-600">Total peserta yang telah mendaftar: <span class="font-semibold">1 orang</span></p>
      </div>
    </div>

    <!-- Tombol Kembali dengan SVG -->
    <div class="flex justify-end mt-6">
      <button
        @click="$router.back()"
        class="flex items-center gap-2 bg-[#4954DE] hover:bg-[#3b44b1] text-white px-6 py-3 rounded-2xl font-semibold shadow-md transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>
        Kembali
      </button>
    </div>
  </div>

</template>



<style scoped>
:deep(tr > td:last-child) {
  text-align: left !important;
}

:deep(th),
:deep(td) {
  border: 1px solid #93c5fd !important; /* garis antar kolom */
}

:deep(thead) {
  background-color: #4954DE;
}

:deep(tr:hover) {
  background-color: #5a63d8 !important;
}
</style>