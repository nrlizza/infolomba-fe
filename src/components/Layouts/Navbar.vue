<script setup>
import { FwbButton, FwbNavbar, FwbNavbarCollapse, FwbNavbarLink } from 'flowbite-vue'
import { useRoute, useRouter } from 'vue-router'
import cookie from 'vue-cookies'
import { jwtDecode } from "jwt-decode";
import { ref, onMounted, onUnmounted } from 'vue';
import avatar from '@/assets/avatar.jpg'
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon, PresentationChart, ListIcon } from "../Icons";
import Navbar from '@/assets/Navbar.svg'

const route = useRoute()
const router = useRouter()

const isDropdownOpen = ref(false)
const scrolled = ref(false)

const token = cookie?.get('token')
const decoded = token ? jwtDecode(token) : null

const logout = () => {
  cookie.remove('token')
  router.push('/login')
  isDropdownOpen.value = false
}

const isActive = (path) => route.path.startsWith(path)

const navigateTo = (path) => {
  router.push(path)
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-[999] flex justify-center p-3 lg:p-4 pointer-events-none">
    <nav 
      class="pointer-events-auto flex items-center justify-between w-full max-w-6xl h-16 px-5 lg:px-8 transition-all duration-500 rounded-[1.75rem] border border-white/20 shadow-[0_8px_32px_0_rgba(73,84,222,0.1)]"
      :class="scrolled ? 'bg-white/90 backdrop-blur-xl scale-[0.98] shadow-[0_20px_50px_rgba(0,0,0,0.08)]' : 'bg-white/95 backdrop-blur-lg shadow-lg'"
    >
      <!-- Logo Section -->
      <router-link 
        to="/beranda" 
        class="flex items-center transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <img :src="Navbar" alt="Logo" class="h-10 lg:h-12 w-auto object-contain" />
      </router-link>

      <!-- Center Links (Desktop) -->
      <div v-if="decoded?.role !== 'PANITIA' && decoded?.role !== 'ADMIN'" class="hidden md:flex items-center gap-1">
        <router-link
          v-for="(item, index) in [
            { label: 'Beranda', path: '/beranda' },
            { label: 'Info Lomba', path: '/info-lomba' },
            { label: 'Riwayat', path: '/riwayat-lomba' }
          ]"
          :key="index"
          :to="item.path"
          class="relative px-5 py-2 text-[14px] font-bold tracking-tight transition-all duration-300 rounded-full group overflow-hidden"
          :class="isActive(item.path) ? 'text-[#4954DE]' : 'text-gray-600 hover:text-[#4954DE]'"
        >
          <span class="relative z-10">{{ item.label }}</span>
          <span 
            class="absolute inset-0 bg-[#4954DE]/5 transition-all duration-300 translate-y-full group-hover:translate-y-0"
            :class="{ '!translate-y-0 !bg-[#4954DE]/8': isActive(item.path) }"
          ></span>
        </router-link>
      </div>

      <!-- Action Buttons / Profile -->
      <div class="flex items-center gap-2 lg:gap-3">
        <template v-if="!token">
          <button
            @click="navigateTo('/login')"
            class="hidden sm:block px-5 py-2 text-[14px] font-bold text-gray-700 hover:text-[#4954DE] transition-colors"
          >
            Login
          </button>
          <button
            @click="navigateTo('/register')"
            class="group relative flex items-center gap-2 px-6 py-2.5 bg-[#4954DE] text-white text-[14px] font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(73,84,222,0.4)] active:scale-95"
          >
            <span class="relative z-10">Register Now</span>
            <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </template>

        <div v-else class="relative">
          <button 
            class="flex items-center gap-2 p-1 rounded-full transition-all duration-300 hover:bg-[#4954DE]/5 group"
            @click.prevent="isDropdownOpen = !isDropdownOpen"
          >
            <div class="relative">
              <img 
                src="/avatar.jpg" 
                alt="User" 
                class="w-8 h-8 lg:w-9 lg:h-9 rounded-full object-cover ring-2 ring-[#4954DE]/10 group-hover:ring-[#4954DE]/30 transition-all shadow-md"
              />
              <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div class="hidden lg:block text-left ml-1">
              <p class="text-[13px] font-bold text-gray-800 leading-tight">{{ decoded?.name }}</p>
              <p class="text-[10px] font-semibold text-[#4954DE] uppercase tracking-wider">{{ decoded?.role }}</p>
            </div>
            <ChevronDownIcon 
              class="hidden lg:block w-3.5 h-3.5 text-gray-400 transition-transform duration-300" 
              :class="{ 'rotate-180': isDropdownOpen }" 
            />
          </button>

          <!-- Modern Dropdown -->
          <transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-4 scale-95"
          >
            <div 
              v-if="isDropdownOpen"
              class="absolute right-0 mt-3 w-64 rounded-[1.25rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              <div class="p-5 bg-[#4954DE]/5 border-b border-gray-50 text-center">
                <img src="/avatar.jpg" class="w-16 h-16 mx-auto rounded-full ring-4 ring-white shadow-lg mb-2" />
                <h4 class="font-bold text-gray-900 text-base leading-tight">{{ decoded?.name }}</h4>
                <span class="inline-block mt-1 px-2.5 py-0.5 bg-[#4954DE] text-white text-[9px] font-black rounded-full uppercase">{{ decoded?.role }}</span>
              </div>

              <div class="p-3">
                <template v-if="decoded?.role === 'PANITIA'">
                  <router-link to="/dashboard-panitia" class="flex items-center gap-3 px-4 py-3 text-gray-600 font-bold rounded-xl transition-all duration-200 hover:bg-[#4954DE]/5 hover:text-[#4954DE] group">
                    <component :is="UserCircleIcon" class="w-5 h-5 transition-colors group-hover:text-[#4954DE]" />
                    <span>Dashboard Panitia</span>
                  </router-link>
                  <router-link to="/beranda" class="flex items-center gap-3 px-4 py-3 text-gray-600 font-bold rounded-xl transition-all duration-200 hover:bg-[#4954DE]/5 hover:text-[#4954DE] group">
                    <component :is="PresentationChart" class="w-5 h-5 transition-colors group-hover:text-[#4954DE]" />
                    <span>Beranda Lomba</span>
                  </router-link>
                  <router-link to="/info-lomba" class="flex items-center gap-3 px-4 py-3 text-gray-600 font-bold rounded-xl transition-all duration-200 hover:bg-[#4954DE]/5 hover:text-[#4954DE] group">
                    <component :is="ListIcon" class="w-5 h-5 transition-colors group-hover:text-[#4954DE]" />
                    <span>Info Lomba</span>
                  </router-link>
                </template>
                
                <template v-if="decoded?.role === 'PESERTA'">
                  <router-link to="/poin-lomba" class="flex items-center gap-3 px-4 py-3 text-gray-600 font-bold rounded-xl transition-all duration-200 hover:bg-[#4954DE]/5 hover:text-[#4954DE] group">
                    <component :is="UserCircleIcon" class="w-5 h-5 transition-colors group-hover:text-[#4954DE]" />
                    <span>Poin Lomba</span>
                  </router-link>
                  <router-link to="/favorite-lomba" class="flex items-center gap-3 px-4 py-3 text-gray-600 font-bold rounded-xl transition-all duration-200 hover:bg-[#4954DE]/5 hover:text-[#4954DE] group">
                    <svg class="w-5 h-5 transition-colors group-hover:text-[#4954DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <span>Simpan Favorit</span>
                  </router-link>
                </template>

                <div class="my-2 border-t border-gray-100"></div>

                <button @click="logout" class="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors group">
                  <LogoutIcon class="w-5 h-5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
</style>
