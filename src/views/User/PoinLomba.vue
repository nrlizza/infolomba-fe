<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserProfile } from '@/composables/tanstack-query/useQuery'

const router = useRouter()

const goToInfoLomba = () => {
  router.push('/info-lomba')
}

const { data: userProfile, isLoading, isError } = useUserProfile()

const maxPoint = ref(100)

const userName = computed(() => {
  const profile = userProfile.value
  return profile?.nama_lengkap || profile?.name || profile?.nama || profile?.username || 'Pengguna'
})

const userPoint = computed(() => userProfile.value?.poin || 0)
const progressPercentage = computed(() => (userPoint.value / maxPoint.value) * 100)
</script>


<template>
  <div class="bg-slate-50/50 py-6 px-4 sm:px-6 overflow-x-hidden">
    <div class="max-w-5xl mx-auto">
      <div class="relative bg-white border-b border-gray-100 -mx-4 sm:-mx-6 lg:mx-0 lg:rounded-t-2xl overflow-hidden mb-6">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-blue-50/30"></div>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>

      <div v-else>
        <div class="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <div class="space-y-5">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div class="relative flex-shrink-0">
                <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-40 transition duration-300"></div>
                <div class="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full ring-2 ring-white shadow-lg">
                  <img src="/avatar.jpg" alt="User Profile" class="w-full h-full object-cover" />
                </div>
              </div>

              <div class="flex-1 text-center sm:text-left">
                <h2 class="text-lg sm:text-xl font-black text-slate-900 mb-2">{{ userName }}</h2>
                <div class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100/80 to-purple-100/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-indigo-200/50 shadow-sm">
                  <span class="text-xs font-bold text-slate-600">Poin:</span>
                  <span class="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{{ userPoint }}</span>
                  <span class="text-base text-slate-400 font-bold">/ {{ maxPoint }}</span>
                </div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center text-xs font-bold mb-2 text-slate-500">
                <span>🚀 Mulai</span>
                <span class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-md">{{ progressPercentage.toFixed(0) }}%</span>
                <span>🎯 Target</span>
              </div>
              <div class="relative h-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                <div 
                  class="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full transition-all duration-700 ease-out"
                  :style="{ width: progressPercentage + '%' }"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-200/50">
              <p class="text-xs font-bold text-slate-500 mb-3 text-center">Cara Mendapatkan Poin</p>
              <div class="space-y-2">
                <div class="group/item relative bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-3 border border-slate-100 hover:border-green-200 overflow-hidden">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-xl -mr-12 -mt-12 group-hover/item:scale-150 transition-transform duration-300"></div>
                  <div class="relative flex items-center gap-3">
                    <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-200">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-black text-slate-900">Ikuti Lomba</h3>
                      <p class="text-xs text-slate-600">Raih +10 poin setiap partisipasi</p>
                    </div>
                    <div class="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                      <span class="text-lg font-black text-green-600">+10</span>
                    </div>
                  </div>
                </div>

                <div class="group/item relative bg-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-3 border border-slate-100 hover:border-amber-200 overflow-hidden">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-xl -mr-12 -mt-12 group-hover/item:scale-150 transition-transform duration-300"></div>
                  <div class="relative flex items-center gap-3">
                    <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-sm group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-200">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-black text-slate-900">Tukar Tiket Gratis</h3>
                      <p class="text-xs text-slate-600">Gunakan 100 poin untuk tiket</p>
                    </div>
                    <div class="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-red-100 to-rose-100 rounded-lg">
                      <span class="text-lg font-black text-red-600">-100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="goToInfoLomba"
              class="group/btn relative w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <svg class="relative w-4 h-4 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="relative">IKUTI LOMBA</span>
              <svg class="relative w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
</template>
