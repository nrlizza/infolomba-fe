<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main :class="[route.name === 'PoinLomba' ? 'pt-20 lg:pt-24' : 'flex-grow pt-20 lg:pt-24']">
      <slot />
    </main>
    <Footer />
  </div>
</template>