<script setup>
import { FwbButton, FwbSelect, FwbProgress } from 'flowbite-vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToBeranda = () => {
  router.push('/beranda')   
}

const userPoint = ref(70)
const maxPoint = ref(100)
const userName = ref('Ahmad Irawan')

const progressPercentage = computed(() => (userPoint.value / maxPoint.value) * 100)
</script>


<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
    <div class="max-w-xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-[#4954DE] mb-3">
          Sistem Reward & Poin Kamu
        </h1>
        <p class="text-gray-600 text-xl">
          Kumpulkan poin dengan mengikuti lomba<br />
          untuk mendapatkan tiket lomba gratis!
        </p>
      </div>

      <!-- Card Poin User -->
      <div class="bg-white rounded-3xl shadow-xl p-8 mb-12 border-4 border-[#4954DE]">
        <!-- User Icon -->
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 bg-[#4954DE] rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- User Info -->
        <div class="text-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ userName }}</h2>
          <h3 class="text-2xl font-bold text-gray-900">
            Poin Kamu: {{ userPoint }} / {{ maxPoint }}
          </h3>
        </div>

        <!-- Progress Bar dengan FwbProgress -->
        <div class="mb-6">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>0 Poin</span>
            <span>{{ maxPoint }} Poin</span>
          </div>
          <fwb-progress 
            :progress="progressPercentage" 
            size="lg"
            color="purple"
          />
        </div>

        <!-- Button Belum Tersedia dengan FwbButton -->
        <div class="text-center mb-4">
          <fwb-button disabled color="default" size="lg">
            📋 Belum Tersedia
          </fwb-button>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto">
      <!-- Cara Mendapatkan Poin -->
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold text-[#4954DE]">
          Cara Mendapatkan Poin
        </h2>
      </div>

      <!-- Cards Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Card Ikuti Lomba -->
        <div class="bg-white rounded-3xl shadow-lg p-8 border-4 border-[#4954DE] text-center">
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Ikuti Lomba</h3>
          <p class="text-gray-600 mb-4">
            Daftar lomba dan langsung raih 10 poin
          </p>
          <p class="text-2xl font-bold text-[#4954DE] mb-4">+10 Poin</p>
          
          <!-- Button dengan FwbButton -->
          <fwb-button gradient="purple-blue" size="lg" class="w-full" @click="goToBeranda">
                Ikuti Lomba
          </fwb-button>
        </div>

        <!-- Card Gunakan Tiket Gratis -->
        <div class="bg-white rounded-3xl shadow-lg p-8 border-4 border-[#4954DE] text-center">
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
              </svg>
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Gunakan Tiket Gratis</h3>
          <p class="text-gray-600 mb-4">
            Tukar 100 poin untuk tiket lomba gratis
          </p>
          <p class="text-2xl font-bold text-[#4954DE] mb-4">-100 Poin</p>
          
          <!-- Button dengan FwbButton -->
          <fwb-button gradient="purple-blue" size="lg" class="w-full" :disabled="userPoint < maxPoint">
            Tukar Tiket Gratis
          </fwb-button>
        </div>
      </div>
    </div>
  </div>
</template>

