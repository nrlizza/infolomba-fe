<script setup>
import { FwbButton, FwbNavbar, FwbNavbarCollapse, FwbNavbarLink } from 'flowbite-vue'
import { useRoute, useRouter } from 'vue-router'
import cookie from 'vue-cookies'
import { jwtDecode } from "jwt-decode";
import { ref } from 'vue';
import avatar from '@/assets/avatar.jpg'

const route = useRoute()
const router = useRouter()

const isDropdownOpen = ref(false)

const token = cookie.get('token')
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

</script>

<template>
  <fwb-navbar class="bg-white border-b border-gray-200 px-4 py-1">
    <template #logo>
      <div class="text-2xl font-extrabold">
        <span class="text-blue-800">ED</span>
        <span class="text-cyan-400">VENT</span>
      </div>
    </template>

    <template #default="{ isShowMenu }">
      <fwb-navbar-collapse :is-show-menu="isShowMenu">
        
        <fwb-navbar-link
          :is-active="isActive('/beranda')"
          link="/beranda"
        >
          Beranda
        </fwb-navbar-link>

        <fwb-navbar-link
          :is-active="isActive('/info-lomba')"
          link="/info-lomba"
        >
          Info Lomba
        </fwb-navbar-link>

        <fwb-navbar-link
          :is-active="isActive('/riwayat-lomba')"
          link="/riwayat-lomba"
        >
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
        <button
          @click="isDropdownOpen = !isDropdownOpen"
          class="flex items-center text-sm bg-gray-100 rounded-full focus:ring-2 focus:ring-gray-300 p-1"
        >
          <span class="sr-only">Open user menu</span>
          <img
            class="w-8 h-8 rounded-full"
            :src="avatar"
            alt="user photo"
          />
        </button>

        <!-- Dropdown -->
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <div class="px-4 py-3 border-b border-gray-200">
            <span class="block text-sm font-medium text-gray-900">{{ decoded?.name || 'User' }}</span>
            <span class="block text-xs text-gray-500 truncate">{{ decoded?.email }}</span>
          </div>
          <ul class="py-1 text-sm text-gray-700">
            <li>
              <a href="/dashboard" class="block px-4 py-2 hover:bg-gray-100">Dashboard</a>
            </li>
            <li>
              <a href="/settings" class="block px-4 py-2 hover:bg-gray-100">Settings</a>
            </li>
            <li>
              <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100">Sign out</button>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </fwb-navbar>
</template>
