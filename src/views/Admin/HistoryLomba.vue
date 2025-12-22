<script setup>
import { ref, computed } from 'vue'
import { FwbButton, FwbSpinner } from 'flowbite-vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { useRouter } from 'vue-router'
import Card from '@/components/Ui/Card.vue'
import Swal from "sweetalert2"
import cookie from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'
import { useAllLombaByIdUser, useDeleteLomba } from '@/composables/tanstack-query/useQuery'

// ===== ambil user dari token =====
const token = cookie.get('token')
const decoded = token ? jwtDecode(token) : null

// ===== payload pagination =====
const payload = ref({
  id_user: decoded?.id,
  page: 1,
  limit: 5
})

// ===== query =====
const { data, isLoading, } = useAllLombaByIdUser(payload)
const { mutateAsync: deleteLomba } = useDeleteLomba()

const router = useRouter()

const goToDetail = (id) => {
  router.push(`/riwayat-daftar-peserta/${id}`)
}

const goToEdit = (id) => {
  router.push(`/edit-lomba/${id}`)
}

// ===== delete modal =====
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
        // Panggil mutation delete dengan payload
        await deleteLomba({
          id_lomba: data.id_lomba,
          id_user: decoded?.id
        })
        
        // Tampilkan success message
        Swal.fire('Terhapus!', 'Lomba berhasil dihapus.', 'success')
      } catch (error) {
        // Tampilkan error message
        Swal.fire('Gagal!', error?.response?.data?.message || 'Terjadi kesalahan saat menghapus lomba.', 'error')
      }
    }
  })
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
</script>

<template>
  <Card>

    <!-- Header -->
    <Card>
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Riwayat Lomba</h1>
        <p class="text-gray-600">Kelola dan Pantau Semua Lomba yang Anda Unggah</p>
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
        <p class="text-lg font-medium py-10">Data Lomba Tidak Tersedia</p>
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
              <h2 class="text-xl font-bold text-white mb-4">
                {{ lomba.nama_lomba }}
              </h2>

              <!-- Info dengan Ikon -->
              <div class="flex flex-wrap items-center gap-4 mb-4">
                <!-- Teknologi -->
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="text-white font-medium">{{ lomba.kategori_lomba }}</span>
                </div>

                <!-- Mahasiswa -->
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                  <span class="text-white font-medium">{{ lomba.tingkat_pendidikan }}</span>
                </div>

                <!-- Tanggal -->
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-white">{{ lomba.tanggal_lomba }}</span>
                </div>
              </div>
            </div>

            <!-- Right Section - Buttons -->
            <div class="flex flex-wrap gap-3">
              <FwbButton color="light" size="lg" class="min-w-[120px]" @click="goToDetail(lomba.id_lomba)">
                <template #prefix>
                  <font-awesome-icon icon="circle-exclamation" class="text-black" />
                </template>
                Detail
              </FwbButton>

              <FwbButton size="lg" class="min-w-[120px] bg-yellow-500 hover:bg-yellow-600"
                @click="goToEdit(lomba.id_lomba)">
                <template #prefix>
                  <font-awesome-icon icon="pen-to-square" class="text-white mr-2" />
                </template>
                Edit
              </FwbButton>

              <FwbButton size="lg" class="min-w-[120px] bg-red-600 hover:bg-red-700" @click="openDeleteModal(lomba)">
                <template #prefix>
                  <font-awesome-icon icon="trash" class="text-white mr-2" />
                </template>
                Delete
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
</template>
