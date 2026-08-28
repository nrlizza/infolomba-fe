<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import Card from "@/components/Ui/Card.vue";
import bg from "@/assets/bg.png";
import mask from "@/assets/Mask group.svg";
import { FwbPagination } from 'flowbite-vue'
import { ref, computed } from 'vue'
import { useAllLomba, useUserProfile } from '@/composables/tanstack-query/useQuery';
import FwbCard from '@/components/Ui/FwbCard.vue';

const router = useRouter();
const { getUser } = useAuth();
const currentPage = ref(1)

const { data, isLoading } = useAllLomba();
const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
const userRole = computed(() => getUser()?.role?.toUpperCase());

const userPoint = computed(() => userProfile.value?.poin || 0);
const maxPoint = ref(100);
const progressPercentage = computed(() => (userPoint.value / maxPoint.value) * 100);

const goToInfoLomba = () => {
  router.push('/info-lomba');
};

const goToPoinLomba = () => {
  router.push('/poin-lomba');
};
</script>

<template>
  <div class="-mt-20 lg:-mt-24">
    <!-- =================== HERO SECTION =================== -->
    <section class="relative min-h-screen pt-32 pb-20 flex items-center text-white px-5 lg:px-20 overflow-hidden" :style="{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }">
      <div class="absolute inset-0 bg-gradient-to-br from-[#4954DE]/20 via-transparent to-[#FFD277]/10"></div>
      
      <div class="relative flex flex-col lg:flex-row items-center w-full justify-between gap-12 lg:gap-16 max-w-7xl mx-auto">

        <!-- TEXT -->
        <div class="max-w-2xl space-y-8 animate-fade-in-up">
          <div class="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-2">
            <p class="text-sm font-semibold text-white/90">Platform Lomba Terpercaya</p>
          </div>
          
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            Temukan dan Ikuti <br />
            Lomba Sesuai <br />
            <span class="relative inline-block">
              <span class="bg-gradient-to-r from-[#FFD277] via-[#FFC847] to-[#FFB017] bg-clip-text text-transparent">
                Passionmu!
              </span>
              <svg class="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C50 5 100 2 150 4C200 6 250 8 298 10" stroke="#FFD277" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </span>
          </h1>

          <p class="text-white/90 text-lg lg:text-xl leading-relaxed font-medium">
            Jelajahi berbagai lomba yang menarik dan kembangkan bakat terbaikmu
            bersama ribuan peserta lainnya.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button @click="goToInfoLomba"
              class="group relative flex items-center justify-center gap-3 bg-white text-[#4657B5] px-8 py-4 rounded-full font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden w-full sm:w-auto">
              <div class="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span class="relative text-xl">🔍</span>
              <span class="relative">JELAJAHI LOMBA</span>
              <svg class="relative w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <button 
              v-if="userRole === 'PESERTA' && !isLoadingProfile && userProfile"
              @click="goToPoinLomba"
              class="group relative flex items-center gap-3 bg-white backdrop-blur-sm px-6 py-4 rounded-full font-bold text-base shadow-lg hover:shadow-2xl border-2 border-[#FFD277] transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden w-full sm:w-auto"
            >
              <div class="relative flex items-center gap-2">
                <svg class="w-5 h-5 text-[#4954DE] group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div class="relative">
                  <span class="text-[#4954DE] text-base">{{ userPoint }}</span>
                  <span class="text-gray-400 text-sm">/ {{ maxPoint }}</span>
                </div>
                <span class="relative text-sm text-gray-600">Poin</span>
              </div>

              <div class="relative w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#f3f4f6" stroke-width="3" />
                  <circle 
                    cx="18" cy="18" r="16" 
                    fill="none" 
                    stroke="#FFD277" 
                    stroke-width="3"
                    :stroke-dasharray="`${progressPercentage} 100`"
                    class="transition-all duration-700"
                  />
                </svg>
                <span class="absolute text-[10px] font-black text-[#4954DE]">{{ progressPercentage.toFixed(0) }}%</span>
              </div>
            </button>
          </div>
        </div>

        <!-- ILLUSTRATION -->
        <div class="relative flex justify-center lg:justify-end animate-fade-in-scale">
          <div class="relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-[#FFD277]/30 to-[#4954DE]/30 rounded-3xl blur-2xl animate-pulse-slow"></div>
            <img :src="mask" class="relative rounded-3xl lg:w-[420px] xl:w-[480px] shadow-2xl transform hover:scale-105 transition-transform duration-500" />
            
            <div class="absolute -top-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl animate-float">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-[#4954DE] to-[#7592ff] rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div class="text-left">
                  <p class="text-[#4954DE] font-bold text-sm">150+ Lomba</p>
                  <p class="text-gray-500 text-xs">Tersedia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =================== LOMBA TERBARU =================== -->
    <section class="relative bg-slate-50 py-12 lg:py-16 overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-[#4954DE]/5 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 -right-24 w-80 h-80 bg-[#FFD277]/10 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-6xl mx-auto px-5 lg:px-8 relative">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div class="text-left">
            <div class="inline-block px-4 py-1.5 bg-[#4954DE]/10 rounded-full mb-3">
              <span class="text-[#4954DE] font-bold text-sm tracking-wider uppercase">Update Terbaru</span>
            </div>
            <h2 class="text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
              LOMBA <span class="bg-[#4954DE] bg-clip-text text-transparent">TERBARU</span>
            </h2>
            <p class="text-gray-500 mt-3 text-base max-w-xl">
              Temukan kompetisi terbaru yang sesuai dengan minat dan bakatmu. Ambil kesempatanmu sekarang!
            </p>
          </div>
          
          <button @click="goToInfoLomba" class="group flex items-center gap-2 text-[#4954DE] font-bold text-base hover:text-[#3641f5] transition-colors">
            Lihat Semua Lomba
            <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          <FwbCard v-for="lomba in data?.data" :key="lomba.nama_lomba" :lomba="lomba" class="animate-fade-in-up" />
        </div>
      </div>
    </section>
  </div>
</template>
