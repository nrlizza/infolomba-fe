<script setup>
import { ref, computed } from 'vue'
import { FwbButton, FwbSpinner } from 'flowbite-vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { useRouter } from 'vue-router'
import Card from '@/components/Ui/Card.vue'
import Swal from "sweetalert2"
import cookie from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'
import { useAllLombaAdmin, useLombaStats, useDeleteLomba } from '@/composables/tanstack-query/useQuery'

const router = useRouter()
const token = cookie.get('token')
const decoded = token ? jwtDecode(token) : null
const { mutateAsync: deleteLomba } = useDeleteLomba()

const openDeleteModal = (data) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: `Data lomba ${data.nama_lomba} ini akan dihapus!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteLomba({
          id_lomba: data.id_lomba,
          id_user: decoded?.id
        })
        Swal.fire('Terhapus!', 'Lomba berhasil dihapus.', 'success')
      } catch (error) {
        Swal.fire('Gagal!', error?.response?.data?.message || 'Terjadi kesalahan saat menghapus lomba.', 'error')
      }
    }
  })
}

// ===== payload pagination =====
const payload = ref({
  page: 1,
  limit: 5,
  status: 'APPROVED' // Default to approved
})

// ===== query =====
const { data, isLoading } = useAllLombaAdmin(computed(() => payload.value.page), computed(() => payload.value.limit), computed(() => payload.value.status))
const { data: stats, isLoading: statsLoading } = useLombaStats()

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

const changeStatusFilter = (status) => {
  payload.value.status = status
  payload.value.page = 1
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card class="bg-green-50 border-l-4 border-green-500 text-center py-6 cursor-pointer hover:bg-green-100 transition" @click="changeStatusFilter('APPROVED')">
        <h3 class="text-xl font-bold text-green-700">Disetujui</h3>
        <p class="text-3xl font-extrabold text-green-600 mt-2" v-if="!statsLoading">{{ stats?.total_approved || 0 }}</p>
        <fwb-spinner v-else size="6" class="mt-2 mx-auto" />
      </Card>
      
      <Card class="bg-red-50 border-l-4 border-red-500 text-center py-6 cursor-pointer hover:bg-red-100 transition" @click="changeStatusFilter('REJECTED')">
        <h3 class="text-xl font-bold text-red-700">Ditolak</h3>
        <p class="text-3xl font-extrabold text-red-600 mt-2" v-if="!statsLoading">{{ stats?.total_rejected || 0 }}</p>
        <fwb-spinner v-else size="6" class="mt-2 mx-auto" />
      </Card>
    </div>

    <Card>
      <!-- Header -->
      <Card>
        <div class="mb-4">
          <h1 class="text-2xl font-bold text-gray-900">Riwayat Lomba ({{ payload.status }})</h1>
          <p class="text-gray-600">Daftar lomba yang telah diproses (disetujui atau ditolak)</p>
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
          <p class="text-lg font-medium py-10">Data Lomba Tidak Tersedia untuk status {{ payload.status }}</p>
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
                <div class="flex items-center gap-3 mb-4">
                  <h2 class="text-xl font-bold text-white">
                    {{ lomba.nama_lomba }}
                  </h2>
                  <span v-if="lomba.status_lomba === 'APPROVED'" class="bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded">APPROVED</span>
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
                    <span class="text-white font-medium">No. Telp Panitia: {{ lomba.kontak_penyelenggara || '-' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-white">Tanggal Unggah: {{ lomba.created_at ? new Date(lomba.created_at).toLocaleDateString('id-ID') : '-' }}</span>
                  </div>
                </div>
              </div>

              <!-- Right Section - Buttons -->
              <div class="flex flex-wrap gap-3">
                <FwbButton size="lg" class="min-w-[120px] bg-blue-500 hover:bg-blue-600"
                  @click="router.push(`/detail-lomba/${lomba.id_lomba}`)">
                  <template #prefix>
                    <font-awesome-icon icon="eye" class="text-white mr-2" />
                  </template>
                  Detail
                </FwbButton>

                <FwbButton size="lg" class="min-w-[120px] bg-red-500 hover:bg-red-600"
                  @click="openDeleteModal(lomba)">
                  <template #prefix>
                    <font-awesome-icon icon="trash" class="text-white mr-2" />
                  </template>
                  Hapus
                </FwbButton>
              </div>
            </div>
          </div>
        </Card>

        <!-- Pagination -->
        <div class="flex justify-between items-center gap-4 mt-6">
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
