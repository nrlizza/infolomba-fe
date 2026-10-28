<template>
  <router-link :to="targetLink" class="flex items-center gap-2">
    <img :src="Navbar" alt="EDVENT Logo" class="h-8 w-auto object-contain" />
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Navbar from '@/assets/Navbar.svg'
import cookie from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'

const token = cookie.get('token')
const decoded = token ? jwtDecode(token) : null

const targetLink = computed(() => {
  if (decoded?.role?.toUpperCase() === 'ADMIN') {
    return '/admin-dashboard'
  }
  if (decoded?.role?.toUpperCase() === 'PANITIA') {
    return '/dashboard-panitia'
  }
  return '/beranda'
})
</script>
