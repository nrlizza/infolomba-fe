<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar'
import Backdrop from './Backdrop.vue'
import cookie from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'

const route = useRoute()
const { isExpanded, isHovered } = useSidebar()

const token = cookie.get('token')
const decoded = token ? jwtDecode(token) : null

// Admin tidak memiliki sidebar sama sekali
const isAdmin = computed(() => {
  return decoded?.role?.toUpperCase() === 'ADMIN' || route.path.startsWith('/admin')
})
</script>

<template>
  <div class="min-h-screen bg-gray-50" :class="{ 'xl:flex': !isAdmin }">
    <!-- Sidebar hanya untuk non-Admin (Panitia) -->
    <template v-if="!isAdmin">
      <app-sidebar />
      <Backdrop />
    </template>

    <!-- Main Content -->
    <div
      class="flex-1 transition-all duration-300 ease-in-out w-full"
      :class="[
        !isAdmin && (isExpanded || isHovered) ? 'lg:ml-[250px]' : '',
        !isAdmin && !(isExpanded || isHovered) ? 'lg:ml-[90px]' : '',
        isAdmin ? 'ml-0' : ''
      ]"
    >
      <app-header :hide-toggle="isAdmin" />
      <div 
        class="w-full min-w-0 mx-auto"
        :class="[isAdmin ? 'max-w-[1600px] p-4 sm:p-6 lg:p-8' : 'max-w-6xl p-3 sm:p-4 md:p-6']"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>
