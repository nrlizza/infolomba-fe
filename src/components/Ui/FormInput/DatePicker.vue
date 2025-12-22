<script setup>
import { Datepicker } from 'flowbite'
import { defineProps, defineEmits, onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  id: {
    type: String,
    default: 'datepicker'
  },
  autoSelectToday: {
    type: Boolean,
    default: true
  },
  minDate: {
    type: Boolean,
    default: false
  },
  maxDate: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

function formatDate(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

onMounted(() => {
  const input = document.getElementById(props.id)
  const today = new Date()

  if (props.autoSelectToday && input) {
    const todayStr = formatDate(today)
    input.value = todayStr
    emit('update:modelValue', todayStr)
  }

  const datepicker = new Datepicker(input, {
    autohide: true,
    format: 'yyyy-mm-dd',
    orientation: 'bottom',
    todayBtn: true,
    clearBtn: true,
    autoSelectToday: props.autoSelectToday,
    minDate: props.minDate ? today : null,
    maxDate: props.maxDate ? today : null,
  })

  // Update modelValue on change
  input.addEventListener('changeDate', (e) => {
    emit('update:modelValue', e.target.value)
  })
})
</script>


<template>
    <div class="mb-2">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ label }}
        </label>
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
            </div>
            <input
                :id="id"
                type="text"
                class="bg-gray-50 leading-1.5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Select Date"
                readonly
                :disabled="disabled"
            />
        </div>
    </div>
</template>
