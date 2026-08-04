<script setup>
import SidebarProvider from "./SidebarProvider.vue";
import DashboardLayout from "./DashboardLayout.vue";
</script>

<template>
  <SidebarProvider>
    <DashboardLayout>
      <slot />
    </DashboardLayout>
  </SidebarProvider>
</template>
