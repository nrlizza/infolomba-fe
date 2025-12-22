<script setup>
const props = defineProps({
  class: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div :class="['rounded-2xl border border-gray-200 bg-white mb-5 p-5 sm:p-6', props.class]">
    <slot></slot>
  </div>
</template>
