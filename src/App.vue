<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "@/components/Layouts/MainLayout.vue";
import EmptyLayout from "@/components/Layouts/EmptyLayout.vue";
import AdminWrapper from "@/components/Layouts/Admin-Layouts/AdminWrapper.vue";

const route = useRoute();

// Pilih layout sesuai meta.layout
const layout = computed(() => {
  switch (route.meta.layout) {
    case "empty":
      return EmptyLayout;
    case "main":
      return MainLayout;
    case "admin":
      return AdminWrapper;
    default:
      return MainLayout; // fallback biar aman
  }
});
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
