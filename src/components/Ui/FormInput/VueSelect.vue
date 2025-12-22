<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { FwbInput } from "flowbite-vue";

// Props
const props = defineProps({
  label: String,
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Pilih opsi...",
  },
  modelValue: {
    type: [String, Number, Object, null],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const search = ref("");
const dropdownRef = ref(null);

// 🔹 Deteksi apakah sudah ada value
const isValueSelected = computed(() => props.modelValue !== null && props.modelValue !== "");

// 🔹 Label dari item terpilih
const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue);
  return selected ? selected.label : "";
});

// 🔹 Filter list berdasarkan input search
const filteredOptions = computed(() => {
  if (!search.value) return props.options;
  return props.options.filter((opt) =>
    opt.label.toLowerCase().includes(search.value.toLowerCase())
  );
});

// 🔹 Saat pilih item
function selectOption(option) {
  emit("update:modelValue", option.value);
  search.value = option.label;
  isOpen.value = false;
}

// 🔹 Reset pilihan
function clearSelection() {
  emit("update:modelValue", null);
  search.value = "";
  isOpen.value = false;
}

// 🔹 Sync search value jika modelValue berubah dari luar
watch(
  () => props.modelValue,
  (newVal) => {
    const found = props.options.find((opt) => opt.value === newVal);
    search.value = found ? found.label : "";
  },
  { immediate: true }
);

// 🔹 Tutup dropdown kalau klik di luar
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div ref="dropdownRef" class="relative w-full space-y-2">
    <!-- Search box -->
    <div class="relative">
      <FwbInput
        :label="label"
        class="bg-white"
        v-model="search"
        :readonly="isValueSelected"
        :placeholder="placeholder"
        @focus="!isValueSelected && (isOpen = true)"
      />

      <!-- Tombol Clear (❌) -->
      <button
        v-if="isValueSelected"
        @click="clearSelection"
        type="button"
        class="absolute right-3 top-[38px] text-gray-400 hover:text-red-500 transition"
      >
        ✕
      </button>
    </div>

    <!-- Dropdown list -->
    <div
      v-if="isOpen"
      class="absolute w-full mt-1 z-50 bg-white border border-gray-300 rounded-md shadow-md"
    >
      <ul class="max-h-60 overflow-auto divide-y divide-gray-100">
        <!-- Kalau ada hasil -->
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          @click="selectOption(option)"
          class="px-4 py-2 hover:bg-blue-100 cursor-pointer transition"
        >
          {{ option.label }}
        </li>

        <!-- Kalau kosong -->
        <li
          v-if="filteredOptions.length === 0"
          class="px-4 py-2 text-gray-500 text-center"
        >
          Sorry, no matching found
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Tambahan biar UX lebih smooth */
button:focus {
  outline: none;
}
</style>
