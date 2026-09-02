<script setup>
import { ref, computed } from 'vue'
import { FwbButton, FwbSpinner } from 'flowbite-vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import Card from '@/components/Ui/Card.vue'
import Swal from "sweetalert2"
import { useRouter } from "vue-router"
import { useAllLombaAdmin, useLombaStats, useApproveLomba } from '@/composables/tanstack-query/useQuery'

const router = useRouter()

// ===== payload pagination =====
const payload = ref({
  page: 1,
  limit: 5,
  status: 'PENDING'
})

// ===== query =====
const { data, isLoading } = useAllLombaAdmin(computed(() => payload.value.page), computed(() => payload.value.limit), computed(() => payload.value.status))
const { data: stats, isLoading: statsLoading } = useLombaStats()
const { mutateAsync: approveLomba } = useApproveLomba()

// ===== modal action =====
const openActionModal = (lomba, actionType) => {
  if (actionType === 'APPROVED') {
    Swal.fire({
      title: 'Setujui Lomba?',
      text: `Apakah Anda yakin ingin menyetujui lomba ${lomba.nama_lomba}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Setujui!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await approveLomba({
            id_lomba: lomba.id_lomba,
            status_lomba: 'APPROVED',
            alasan_penolakan: null
          })
          Swal.fire('Disetujui!', 'Lomba berhasil disetujui.', 'success')
        } catch (error) {
          Swal.fire('Gagal!', error?.response?.data?.message || 'Terjadi kesalahan.', 'error')
        }
      }
    })
  } else if (actionType === 'REJECTED') {
    Swal.fire({
      title: 'Tolak Lomba?',
      text: `Tuliskan alasan penolakan untuk lomba ${lomba.nama_lomba}:`,
      input: 'textarea',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Tolak',
      cancelButtonText: 'Batal',
      inputValidator: (value) => {
        if (!value) {
          return 'Alasan penolakan tidak boleh kosong!'
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await approveLomba({
            id_lomba: lomba.id_lomba,
            status_lomba: 'REJECTED',
            alasan_penolakan: result.value
          })
          Swal.fire('Ditolak!', 'Lomba berhasil ditolak.', 'success')
        } catch (error) {
          Swal.fire('Gagal!', error?.response?.data?.message || 'Terjadi kesalahan.', 'error')
        }
      }
    })
  }
}

// ===== pagination helpers =====
const pagination = computed(() => data.value?.pagination ?? {})
const lombaList = computed(() => data.value?.data ?? [])

const nextPage = () => {
  if (payload.value.page < pagination.value.totalPages) {
    payload.value.page++
  }
}

const prevPage = () => {
  if (payload.value.page > 1) {
    payload.value.page--
  }
}

// Tidak perlu changeStatusFilter karena dashboard hanya fokus pada PENDING
</script>

<template>
  <div class="space-y-6">
    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card class="bg-yellow-50 border-l-4 border-yellow-500 text-center py-6 cursor-pointer hover:bg-yellow-100 transition">
        <h3 class="text-xl font-bold text-yellow-700">Lomba Menunggu Persetujuan</h3>
        <p class="text-3xl font-extrabold text-yellow-600 mt-2" v-if="!statsLoading">{{ stats?.total_pending || 0 }}</p>
        <fwb-spinner v-else size="6" class="mt-2 mx-auto" />
      </Card>
      
      <Card class="bg-blue-50 border-l-4 border-blue-500 text-center py-6 cursor-pointer hover:bg-blue-100 transition">
        <h3 class="text-xl font-bold text-blue-700">Total Lomba Aktif di Edvent</h3>
        <p class="text-3xl font-extrabold text-blue-600 mt-2" v-if="!statsLoading">{{ stats?.total_approved || 0 }}</p>
        <fwb-spinner v-else size="6" class="mt-2 mx-auto" />
      </Card>
    </div>

    <Card>
      <!-- Header -->
      <Card>
        <div class="mb-4">
          <h1 class="text-2xl font-bold text-gray-900">Validasi Lomba</h1>
          <p class="text-gray-600">Daftar lomba yang menunggu persetujuan Anda</p>
        </div>
      </Card>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-10">
        <div class="flex justify-center items-center h-32">
          <fwb-spinner size="10" aria-label="Loading..." />
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="lombaList.length === 0" class="text-center text-gray-500">
        <Card>
          <p class="text-lg font-medium py-10">Data Lomba yang menunggu persetujuan tidak tersedia</p>
        </Card>
      </div>

      <div v-else>
        <!-- List -->
        <Card>
          <div v-for="(lomba, index) in lombaList" :key="index"
            class="bg-[#4954DE] rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <!-- Left -->
              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                  <h2 class="text-lg sm:text-xl font-bold text-white break-words">
                    {{ lomba.nama_lomba }}
                  </h2>
                  <span v-if="lomba.status_lomba === 'PENDING'" class="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">PENDING</span>
                  <span v-else-if="lomba.status_lomba === 'APPROVED'" class="bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded">APPROVED</span>
                  <span v-else-if="lomba.status_lomba === 'REJECTED'" class="bg-red-400 text-red-900 text-xs font-bold px-2 py-1 rounded">REJECTED</span>
                </div>

                <div v-if="lomba.alasan_penolakan" class="mb-4 bg-red-500 bg-opacity-20 p-3 rounded-lg border border-red-300">
                  <p class="text-white text-sm font-semibold">Alasan Penolakan: {{ lomba.alasan_penolakan }}</p>
                </div>

                <!-- Info dengan Ikon -->
                <div class="flex flex-wrap items-center gap-4 mb-4">
                  <div class="flex items-center gap-2">
                    <span class="text-white font-medium">Asal Institusi: {{ lomba.institusi_penyelenggara || '-' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-white font-medium">No.Telepon: {{ lomba.kontak_penyelenggara || '-' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-white">Tanggal Unggah: {{ lomba.created_at ? new Date(lomba.created_at).toLocaleDateString('id-ID') : '-' }}</span>
                  </div>
                </div>
              </div>

              <!-- Right Section - Buttons -->
              <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto" v-if="lomba.status_lomba === 'PENDING'">
                <FwbButton size="lg" class="w-full sm:w-auto sm:min-w-[120px] bg-blue-500 hover:bg-blue-600"
                  @click="router.push(`/detail-lomba/${lomba.id_lomba}`)">
                  <template #prefix>
                    <font-awesome-icon icon="eye" class="text-white mr-2" />
                  </template>
                  Detail
                </FwbButton>

                <FwbButton size="lg" class="w-full sm:w-auto sm:min-w-[120px] bg-green-500 hover:bg-green-600"
                  @click="openActionModal(lomba, 'APPROVED')">
                  <template #prefix>
                    <font-awesome-icon icon="check" class="text-white mr-2" />
                  </template>
                  Setujui
                </FwbButton>

                <FwbButton size="lg" class="w-full sm:w-auto sm:min-w-[120px] bg-red-600 hover:bg-red-700" @click="openActionModal(lomba, 'REJECTED')">
                  <template #prefix>
                    <font-awesome-icon icon="xmark" class="text-white mr-2" />
                  </template>
                  Tolak
                </FwbButton>
              </div>
            </div>
          </div>
        </Card>

        <!-- Pagination -->
        <div class="flex flex-wrap justify-between items-center gap-3 mt-6">
          <FwbButton size="lg" class="ml-4" :disabled="payload.page === 1" @click="prevPage">
            Prev
          </FwbButton>

          <span class="text-white text-lg px-4 py-2 border rounded-lg bg-brand-500">
            Page {{ payload.page }} dari {{ pagination.totalPages }}
          </span>

          <FwbButton size="lg" class="mr-4" :disabled="payload.page === pagination.totalPages" @click="nextPage">
            Next
          </FwbButton>
        </div>

      </div>
    </Card>
  </div>
</template>
