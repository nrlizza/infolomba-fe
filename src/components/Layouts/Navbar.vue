<script setup>
import { FwbButton, FwbNavbar, FwbNavbarCollapse, FwbNavbarLink } from 'flowbite-vue'
import { useRoute, useRouter } from 'vue-router'
import cookie from 'vue-cookies'
import { jwtDecode } from "jwt-decode";
import { ref } from 'vue';
import avatar from '@/assets/avatar.jpg'
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from "../Icons";

const route = useRoute()
const router = useRouter()

const isDropdownOpen = ref(false)

const token = cookie?.get('token')
const decoded = token ? jwtDecode(token) : null
console.log("Get token", token)
const logout = () => {
  cookie.remove('token')
  router.push('/login')
  isDropdownOpen.value = false
}

const isActive = (path) => route.path.startsWith(path)

const navigateTo = (path) => {
  router.push(path)
}

</script>

<template>
  <fwb-navbar class="bg-white border-b border-gray-200 px-4 py-1">
    <template #logo>
      <router-link to="/beranda">
        <div class="text-2xl font-extrabold">
          <span class="text-blue-800">ED</span>
          <span class="text-cyan-400">VENT</span>
        </div>
      </router-link>
    </template>

    <template #default="{ isShowMenu }">
      <fwb-navbar-collapse :is-show-menu="isShowMenu">

        <fwb-navbar-link :is-active="isActive('/beranda')" link="/beranda">
          Beranda
        </fwb-navbar-link>

        <fwb-navbar-link :is-active="isActive('/info-lomba')" link="/info-lomba">
          Info Lomba
        </fwb-navbar-link>

        <fwb-navbar-link :is-active="isActive('/riwayat-lomba')" link="/riwayat-lomba">
          Riwayat
        </fwb-navbar-link>

      </fwb-navbar-collapse>
    </template>

    <template v-if="!token" #right-side>
      <fwb-button class="bg-[#4954DE]" @click="navigateTo('/login')">
        Login
      </fwb-button>
      <fwb-button class="ml-2 bg-[#4954DE]" @click="navigateTo('/register')">
        Register
      </fwb-button>
    </template>

    <template v-else #right-side>
      <div class="relative">
        <!-- Tombol profile -->
        <button class="flex items-center text-gray-700 dark:text-gray-400"
          @click.prevent="isDropdownOpen = !isDropdownOpen">
          <span class="mr-3 overflow-hidden rounded-full h-9 w-9">
            <img src="/avatar.jpg" alt="User" />
          </span>

          <span class="block mr-1 font-medium text-theme-sm">{{ decoded?.name }}</span>
        </button>

        <!-- Dropdown -->
        <div v-if="isDropdownOpen"
          class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark lg:right-0 md:right-0">

          <ul class="flex flex-col gap-1 pt-2 pb-3 border-b border-gray-200 dark:border-gray-800">
            <li v-if="decoded?.role === 'PANITIA'">
              <router-link to="/dashboard-panitia"
                class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                <!-- SVG icon would go here -->
                <component :is="UserCircleIcon"
                  class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                Dashboard
              </router-link>
            </li>
            
            <li v-if="decoded?.role === 'PESERTA'">
              <router-link to="/poin-lomba"
                class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                <!-- SVG icon would go here -->
                <component :is="UserCircleIcon"
                  class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                Poin Lomba
              </router-link>
            </li>
            <li>
              <router-link to="/#"
                class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                <!-- SVG icon would go here -->
                <component :is="SettingsIcon"
                  class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                Settings
              </router-link>
            </li>
            <li>
              <router-link to="/#"
                class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                <!-- SVG icon would go here -->
                <component :is="InfoCircleIcon"
                  class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                Support
              </router-link>
            </li>
          </ul>

          <router-link to="/login" @click="logout"
            class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
            <LogoutIcon class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            Sign out
          </router-link>
        </div>
      </div>
    </template>
  </fwb-navbar>
</template>
