<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  router.push('/beranda')
});
</script>

<template>
  <div></div>
</template>
