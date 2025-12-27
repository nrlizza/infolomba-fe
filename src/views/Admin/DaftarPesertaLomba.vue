<script setup>
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbSpinner,
} from 'flowbite-vue'
import { useAllRiwayatLomba } from '@/composables/tanstack-query/useQuery'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

// Ambil id_lomba dari route params
const route = useRoute()
const idLomba = computed(() => route.params.id)

// Filter berdasarkan id_lomba
const filters = computed(() => {
  if (idLomba.value) {
    return { id_lomba: idLomba.value }
  }
  return {}
})

// Fetch data riwayat lomba dengan filter
const { data: riwayatLomba, isLoading } = useAllRiwayatLomba(1, 100, filters)

// Computed untuk mendapatkan data dan total
const pesertaList = computed(() => riwayatLomba.value?.data ?? [])
const totalPeserta = computed(() => riwayatLomba.value?.total ?? 0)

// Format tanggal
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
  <div class="p-6 md:p-8 max-w-7xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-2">Daftar Peserta Lomba</h2>
    <p class="text-gray-600 mb-6">Kelola dan pantau peserta lomba yang telah mendaftar</p>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-10">
      <div class="flex justify-center items-center h-32">
        <fwb-spinner size="10" aria-label="Loading..." />
      </div>
    </div>

    <!-- Data Table -->
    <div v-else class="overflow-x-auto rounded-lg border border-gray-200">
      <fwb-table class="min-w-full border border-blue-600">
        <fwb-table-head>
          <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">Nama
            Lengkap</fwb-table-head-cell>
          <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">Nomor
            Telepon</fwb-table-head-cell>
          <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">Nama
            Lomba</fwb-table-head-cell>
          <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">Tanggal
            Daftar</fwb-table-head-cell>
          <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">Status
            Pembayaran</fwb-table-head-cell>
          <fwb-table-head-cell class="px-4 py-3 bg-[#4954DE] text-white border border-blue-300">Jumlah
            Pembayaran</fwb-table-head-cell>

        </fwb-table-head>

        <fwb-table-body>
          <!-- Jika tidak ada data -->
          <fwb-table-row v-if="pesertaList.length === 0">
            <fwb-table-cell colspan="6" class="px-4 py-6 text-center text-gray-500">
              Tidak ada peserta yang terdaftar
            </fwb-table-cell>
          </fwb-table-row>

          <!-- Loop data peserta -->
          <fwb-table-row v-for="peserta in pesertaList" :key="peserta.id_riwayat"
            class="bg-[#6A73E6] hover:bg-[#5a63d8] text-black">
            <fwb-table-cell class="px-4 py-3 text-black border border-blue-300">
              {{ peserta.name || '-' }}
            </fwb-table-cell>
            <fwb-table-cell class="px-4 py-3 text-black border border-blue-300">
              {{ peserta.nomor_telephone || '-' }}
            </fwb-table-cell>
            <fwb-table-cell class="px-4 py-3 text-black border border-blue-300">
              {{ peserta.nama_lomba || '-' }}
            </fwb-table-cell>
            <fwb-table-cell class="px-4 py-3 text-black border border-blue-300">
              {{ formatDate(peserta.tanggal_daftar) }}
            </fwb-table-cell>
            <fwb-table-cell class="px-4 py-3 text-black border border-blue-300">
              {{ peserta.status_pembayaran ? peserta.status_pembayaran : '-' }}
            </fwb-table-cell>
            <fwb-table-cell class="px-4 py-3 text-black border border-blue-300">
              {{ peserta.jumlah_bayar ?? '-' }}
            </fwb-table-cell>
          </fwb-table-row>
        </fwb-table-body>
      </fwb-table>
    </div>

    <!-- Informasi tambahan -->
    <div v-if="!isLoading" class="mt-6 p-2 bg-gray-50 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"></path>
        </svg>
        <p class="text-sm text-gray-600">Total peserta yang telah mendaftar: <span class="font-semibold">{{ totalPeserta
            }} orang</span></p>
      </div>
    </div>

    <!-- Tombol Kembali dengan SVG -->
    <div class="flex justify-end mt-6">
      <button @click="$router.back()"
        class="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-md transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
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
  border: 1px solid #93c5fd !important;
  /* garis antar kolom */
}

:deep(thead) {
  background-color: #4954DE;
}

:deep(tr:hover) {
  background-color: #5a63d8 !important;
}
</style>