<script setup>
import { ref, computed } from 'vue'
import { FwbButton, FwbSpinner } from 'flowbite-vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { useRouter } from 'vue-router'
import Card from '@/components/Ui/Card.vue'
import cookie from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'
import { useAllLombaByIdUser } from '@/composables/tanstack-query/useQuery'
import ikonDitolak from '@/assets/ikon ditolak.png'

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

// Modal State Alasan Penolakan
const showRejectModal = ref(false)
const selectedRejectedLomba = ref(null)

const handleDetail = (lomba) => {
  if (lomba.status_lomba === 'REJECTED') {
    selectedRejectedLomba.value = lomba
    showRejectModal.value = true
  } else {
    router.push(`/riwayat-daftar-peserta/${lomba.id_lomba}`)
  }
}

const closeRejectModal = () => {
  showRejectModal.value = false
  selectedRejectedLomba.value = null
}

const goToEdit = (id) => {
  router.push(`/edit-lomba/${id}`)
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
              <div class="flex items-center gap-3 mb-4">
                <h2 class="text-xl font-bold text-white">
                  {{ lomba.nama_lomba }}
                </h2>
                <span v-if="lomba.status_lomba === 'PENDING'" class="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1">
                  ⏳ Pending
                </span>
                <span v-else-if="lomba.status_lomba === 'APPROVED'" class="bg-green-400 text-green-900 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1">
                  ✅ Approved
                </span>
                <span v-else-if="lomba.status_lomba === 'REJECTED'" class="bg-red-400 text-red-900 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1">
                  ❌ Rejected
                </span>
              </div>

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
              <FwbButton color="light" size="lg" class="min-w-[120px]" @click="handleDetail(lomba)">
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

    <!-- Modal Pop-up Alasan Penolakan Lomba (Design matching custom mockup) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showRejectModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
          @click.self="closeRejectModal"
        >
          <Transition
            enter-active-class="transition duration-250 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showRejectModal"
              class="relative w-full max-w-[420px] bg-white rounded-[32px] overflow-hidden shadow-2xl"
            >
              <!-- Header Illustration Container -->
              <div class="relative h-[220px] w-full overflow-hidden bg-gradient-to-br from-[#122372] via-[#1c2e8c] to-[#2b419e]">
                <!-- Decorative Background SVG -->
                <svg
                  class="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 420 220"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <!-- Squiggle Upper Left -->
                  <path d="M 12 36 Q 22 24 34 36 T 56 36 T 76 28" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9" />
                  
                  <!-- Coral Circle Left -->
                  <ellipse cx="25" cy="115" rx="55" ry="50" fill="#fa7060" />
                  
                  <!-- Dot Grid Left -->
                  <g fill="#4d6bdb" opacity="0.95">
                    <circle cx="85" cy="74" r="3" />
                    <circle cx="98" cy="74" r="3" />
                    <circle cx="111" cy="74" r="3" />
                    <circle cx="85" cy="87" r="3" />
                    <circle cx="98" cy="87" r="3" />
                    <circle cx="111" cy="87" r="3" />
                    <circle cx="85" cy="100" r="3" />
                    <circle cx="98" cy="100" r="3" />
                    <circle cx="111" cy="100" r="3" />
                  </g>
                  
                  <!-- Spark/Burst Lines Behind Envelope (Left) -->
                  <g stroke="#fa5252" stroke-width="3.5" stroke-linecap="round">
                    <line x1="150" y1="52" x2="136" y2="40" />
                    <line x1="144" y1="70" x2="128" y2="66" />
                    <line x1="148" y1="88" x2="132" y2="92" />
                  </g>

                  <!-- Right Side Dark Overlays -->
                  <circle cx="410" cy="40" r="110" fill="#1b2a75" opacity="0.65" />
                  <circle cx="390" cy="10" r="85" fill="#152161" opacity="0.75" />
                  
                  <!-- Floating Coral Dot Right -->
                  <circle cx="310" cy="72" r="9" fill="#fa7060" />
                  
                  <!-- Floating Soft Blue Circle Right -->
                  <circle cx="350" cy="120" r="28" fill="#7fa4f7" opacity="0.6" />
                  
                  <!-- Soft Coral Halo Behind Envelope -->
                  <ellipse cx="215" cy="120" rx="58" ry="48" fill="#fbb6b1" opacity="0.7" />

                  <!-- Bottom Wave Curve (White) matching user screenshot -->
                  <path d="M 0 162 C 40 120 95 115 145 138 C 195 160 235 172 290 156 C 345 140 385 125 420 135 L 420 225 L 0 225 Z" fill="#ffffff" />
                </svg>

                <!-- Close Button (Top Right) -->
                <button
                  type="button"
                  aria-label="Tutup"
                  class="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  @click="closeRejectModal"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <!-- Center Icon -->
                <div class="absolute inset-x-0 bottom-2 flex justify-center z-10 pointer-events-none">
                  <img :src="ikonDitolak" alt="Ditolak" class="w-32 h-32 sm:w-36 sm:h-36 object-contain drop-shadow-md" />
                </div>
              </div>

              <!-- Modal Content -->
              <div class="px-6 pt-3 pb-8 text-center">
                <h3 class="text-2xl font-extrabold text-[#111827] tracking-tight leading-snug">
                  Pengajuan Lomba Ditolak
                </h3>
                <p class="text-xl font-bold text-[#111827] mt-0.5 break-words">
                  {{ selectedRejectedLomba?.nama_lomba }}
                </p>

                <div class="mt-6">
                  <p class="text-sm font-medium text-gray-500">
                    Alasan Penolakan dari Admin:
                  </p>
                  <p class="text-base font-semibold text-gray-800 mt-1 px-4 leading-relaxed break-words">
                    {{ selectedRejectedLomba?.alasan_penolakan || 'Tidak ada catatan alasan penolakan yang dilampirkan oleh admin.' }}
                  </p>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

  </Card>
</template>
