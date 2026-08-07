<script setup>
import { FwbButton, FwbSelect, FwbProgress, FwbSpinner } from 'flowbite-vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserProfile } from '@/composables/tanstack-query/useQuery'

const router = useRouter()

const goToBeranda = () => {
  router.push('/beranda')
}

// Fetch user profile dengan poin dari database
const { data: userProfile, isLoading, isError } = useUserProfile()

const maxPoint = ref(100)

// Computed properties dari data API
const userName = computed(() => {
  const profile = userProfile.value
  return profile?.nama_lengkap || profile?.name || profile?.nama || profile?.username || 'Pengguna'
})
const userPoint = computed(() => userProfile.value?.poin || 0)
const progressPercentage = computed(() => (userPoint.value / maxPoint.value) * 100)
</script>


<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
          SISTEM <span class="text-indigo-600">POIN LOMBA</span>
        </h1>
        <p class="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Kumpulkan poin dengan mengikuti lomba untuk mendapatkan tiket lomba gratis!
        </p>
      </div>

      <!-- Card Poin User -->
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 mb-12 border border-indigo-100">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- User Icon -->
          <div class="flex justify-center mb-6">
            <div class="w-24 h-24 overflow-hidden rounded-full ring-4 ring-indigo-100 shadow-md">
              <img src="/avatar.jpg" alt="User Profile" class="w-full h-full object-cover" />
            </div>
          </div>

          <!-- User Info -->
          <div class="text-center mb-8">
            <h2 class="text-xl font-bold text-slate-800 mb-2">{{ userName }}</h2>
            <div class="inline-flex items-baseline gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-xl">
              <span class="text-sm font-semibold text-slate-600">Poin Kamu:</span>
              <span class="text-3xl font-black text-indigo-600">{{ userPoint }}</span>
              <span class="text-lg text-slate-400 font-medium">/ {{ maxPoint }}</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-8">
            <div class="flex justify-between text-xs font-semibold mb-3 text-slate-500">
              <span>🚀 Mulai</span>
              <span>{{ progressPercentage.toFixed(0) }}%</span>
              <span>🎯 Target</span>
            </div>
            <div class="relative h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                class="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 shadow-md"
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
          </div>

          <!-- Button -->
          <div class="text-center">
            <button
              @click="goToBeranda"
              class="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              IKUTI LOMBA
            </button>
          </div>
        </div>
      </div>

      <!-- Cara Mendapatkan Poin -->
      <div class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-black text-slate-900 mb-2">
          Cara Mendapatkan <span class="text-indigo-600">Poin</span>
        </h2>
        <p class="text-slate-500 text-sm">Raih poin dengan cara berikut</p>
      </div>

      <!-- Cards Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Card Ikuti Lomba -->
        <div class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-slate-100 hover:border-indigo-200">
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <svg class="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2 text-center">Ikuti Lomba</h3>
          <p class="text-slate-600 mb-4 text-center text-sm leading-relaxed">
            Daftar lomba dan langsung raih 10 poin untuk setiap partisipasi
          </p>
          <div class="text-center">
            <span class="inline-flex items-baseline gap-1 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <span class="text-2xl font-black text-green-600">+10</span>
              <span class="text-sm font-semibold text-green-600">Poin</span>
            </span>
          </div>
        </div>

        <!-- Card Gunakan Tiket Gratis -->
        <div class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-slate-100 hover:border-amber-200">
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <svg class="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2 text-center">Gunakan Tiket Gratis</h3>
          <p class="text-slate-600 mb-4 text-center text-sm leading-relaxed">
            Tukar 100 poin untuk mendapatkan tiket lomba gratis
          </p>
          <div class="text-center">
            <span class="inline-flex items-baseline gap-1 px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg">
              <span class="text-2xl font-black text-red-600">-100</span>
              <span class="text-sm font-semibold text-red-600">Poin</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
