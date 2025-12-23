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
const { data, isLoading } = useAllLombaByIdUser(payload)

const router = useRouter()

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
  <div class="mt-5">
    <!-- Header -->
    <Card>
      <div class="py-5">
        <h1 class="text-2xl text-center font-bold text-gray-900">RIWAYAT LOMBA</h1>
        <p class="text-gray-600 text-center mt-2">Kelola dan Pantau Semua Lomba yang Anda Ikuti</p>
      </div>
    </Card>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-10">
      <div class="flex justify-center items-center h-32">
        <FwbSpinner size="10" />
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="lombaList.length === 0" class="text-center text-gray-500">
      <Card>
        <p v-if="token" class="text-lg font-medium py-28">Data Lomba Tidak Tersedia</p>
        <p v-else class="text-lg font-medium py-28">Silahkan Login Terlebih Dahulu</p>
      </Card>
    </div>

    <!-- List -->
    <div v-else>
      <Card>
        <div v-for="(lomba, index) in lombaList" :key="index"
          class="bg-[#4954DE] rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div class="flex flex-col lg:flex-row justify-between gap-4">

            <!-- LEFT -->
            <div class="flex-1">

              <!-- Judul + Badge -->
              <div class="flex items-center gap-3 mb-4">
                <h2 class="text-xl font-bold text-white">
                  {{ lomba.nama_lomba }}
                </h2>

                <!-- PAID -->
                <span v-if="lomba.status_pembayaran === 'PAID'"
                  class="px-3 py-1 text-sm font-semibold rounded-full bg-green-500 text-white">
                  ✔ Paid
                </span>

                <!-- PENDING -->
                <span v-else-if="lomba.status_pembayaran === 'PENDING'"
                  class="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-400 text-black">
                  ⏳ Pending
                </span>

                <!-- DEFAULT -->
                <span v-else class="px-3 py-1 text-sm font-semibold rounded-full bg-red-500 text-white">
                  ✖ Belum Bayar
                </span>
              </div>

              <!-- Info -->
              <div class="flex flex-wrap items-center gap-4">
                <!-- Kategori -->
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="text-white font-medium">{{ lomba.kategori_lomba }}</span>
                </div>

                <!-- Pendidikan -->
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-white font-medium">
                    {{ lomba.tingkat_pendidikan }}
                  </span>
                </div>

                <!-- Tanggal -->
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-white">{{ lomba.tanggal_lomba }}</span>
                </div>
              </div>
            </div>

            <!-- RIGHT -->
            <div class="flex items-center">
              <FwbButton color="light" size="lg">
                <template #prefix>
                  <FontAwesomeIcon icon="circle-exclamation" />
                </template>
                Detail
              </FwbButton>
            </div>

          </div>
        </div>
      </Card>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-6">
        <FwbButton :disabled="payload.page === 1" @click="prevPage">
          Prev
        </FwbButton>

        <span class="text-white px-4 py-2 rounded-lg bg-brand-500">
          Page {{ payload.page }} dari {{ pagination.totalPages }}
        </span>

        <FwbButton :disabled="payload.page === pagination.totalPages" @click="nextPage">
          Next
        </FwbButton>
      </div>
    </div>
  </div>
</template>
