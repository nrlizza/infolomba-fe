<script setup>
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow pt-20 lg:pt-24">
      <slot />
    </main>
    <Footer />
  </div>
</template>