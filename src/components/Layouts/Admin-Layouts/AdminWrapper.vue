<script setup>
import SidebarProvider from "./SidebarProvider.vue";
import AdminLayout from "./AdminLayout.vue";
</script>

<template>
  <SidebarProvider>
    <AdminLayout>
      <slot />
    </AdminLayout>
  </SidebarProvider>
</template>
