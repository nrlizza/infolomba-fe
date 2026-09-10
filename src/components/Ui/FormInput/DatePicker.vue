<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Tanggal' },
  id: { type: String, default: 'datepicker' },
  minDate: { type: Boolean, default: false },
  maxDate: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])
const calendarOpen = ref(false)
const calendarMode = ref('days')
const calendarViewDate = ref(new Date())
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const today = () => { const date = new Date(); date.setHours(23, 59, 59, 999); return date }
const yearRangeStart = computed(() => Math.floor(calendarViewDate.value.getFullYear() / 10) * 10)
const yearRange = computed(() => Array.from({ length: 10 }, (_, index) => yearRangeStart.value + index))
const calendarDays = computed(() => {
  const year = calendarViewDate.value.getFullYear()
  const month = calendarViewDate.value.getMonth()
  const startDate = new Date(year, month, 1 - new Date(year, month, 1).getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    const isBeforeToday = date < new Date(new Date().setHours(0, 0, 0, 0))
    const isAfterToday = date > today()
    return {
      value: formatDate(date),
      day: date.getDate(),
      currentMonth: date.getMonth() === month,
      selected: props.modelValue === formatDate(date),
      disabled: (props.minDate && isBeforeToday) || (props.maxDate && isAfterToday)
    }
  })
})

const changeMonth = (amount) => { calendarViewDate.value = new Date(calendarViewDate.value.getFullYear(), calendarViewDate.value.getMonth() + amount, 1) }
const changeYear = (amount) => { calendarViewDate.value = new Date(calendarViewDate.value.getFullYear() + amount, calendarViewDate.value.getMonth(), 1) }
const changeDecade = (amount) => { calendarViewDate.value = new Date(calendarViewDate.value.getFullYear() + amount * 10, calendarViewDate.value.getMonth(), 1) }
const selectYear = (year) => { calendarViewDate.value = new Date(year, calendarViewDate.value.getMonth(), 1); calendarMode.value = 'months' }
const selectMonth = (month) => { calendarViewDate.value = new Date(calendarViewDate.value.getFullYear(), month, 1); calendarMode.value = 'days' }
const selectDate = (day) => { if (!day.disabled) { emit('update:modelValue', day.value); calendarOpen.value = false } }
const openCalendar = () => {
  if (props.modelValue) calendarViewDate.value = new Date(`${props.modelValue}T00:00:00`)
  calendarMode.value = 'days'
  calendarOpen.value = true
}
</script>

<template>
  <div class="relative">
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}<span v-if="required" class="text-red-500"> *</span></label>
    <button :id="id" type="button" class="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-left text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500" @click="openCalendar">
      <svg class="h-4 w-4 flex-shrink-0 text-gray-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 0 1 2H5a1 1 0 0 0-1-2Z" /></svg>
      <span :class="modelValue ? 'text-gray-900' : 'text-gray-400'">{{ modelValue || (label === 'Tanggal Lahir' ? 'Pilih tanggal lahir' : 'Pilih tanggal') }}</span>
    </button>
    <div v-if="calendarOpen" class="absolute left-0 top-full z-[10001] mt-2 w-[280px] rounded-lg bg-white p-4 shadow-xl ring-1 ring-black/5" @click.stop>
      <div class="mb-4 flex items-center justify-between">
        <button type="button" class="rounded-md p-1.5 text-gray-700 hover:bg-gray-100" @click="calendarMode === 'years' ? changeDecade(-1) : calendarMode === 'months' ? changeYear(-1) : changeMonth(-1)" aria-label="Sebelumnya"><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7" /></svg></button>
        <button v-if="calendarMode === 'days'" type="button" class="rounded-md px-3 py-2 text-sm font-bold hover:bg-gray-100" @click="calendarMode = 'months'">{{ monthNames[calendarViewDate.getMonth()] }} {{ calendarViewDate.getFullYear() }}</button>
        <button v-else-if="calendarMode === 'months'" type="button" class="rounded-md px-3 py-2 text-sm font-bold hover:bg-gray-100" @click="calendarMode = 'years'">{{ calendarViewDate.getFullYear() }}</button>
        <span v-else class="px-3 py-2 text-sm font-bold">{{ yearRangeStart }}-{{ yearRangeStart + 9 }}</span>
        <button type="button" class="rounded-md p-1.5 text-gray-700 hover:bg-gray-100" @click="calendarMode === 'years' ? changeDecade(1) : calendarMode === 'months' ? changeYear(1) : changeMonth(1)" aria-label="Berikutnya"><svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m9 5 7 7-7 7" /></svg></button>
      </div>
      <div v-if="calendarMode === 'days'" class="mb-2 grid grid-cols-7 text-center text-xs font-medium text-gray-500"><span v-for="day in weekDays" :key="day">{{ day }}</span></div>
      <div v-if="calendarMode === 'days'" class="grid grid-cols-7 gap-y-1 text-center"><button v-for="day in calendarDays" :key="day.value" type="button" :disabled="day.disabled" :class="['mx-auto flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium', !day.currentMonth && 'text-gray-300', day.currentMonth && !day.disabled && !day.selected && 'text-gray-700 hover:bg-gray-100', day.disabled && 'cursor-not-allowed text-gray-300', day.selected && 'bg-blue-600 text-white']" @click="selectDate(day)">{{ day.day }}</button></div>
      <div v-else-if="calendarMode === 'months'" class="grid grid-cols-4 gap-2 text-center"><button v-for="(month, index) in monthShortNames" :key="month" type="button" :class="['rounded-lg px-2 py-3 text-sm font-semibold', index === calendarViewDate.getMonth() ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100']" @click="selectMonth(index)">{{ month }}</button></div>
      <div v-else class="grid grid-cols-4 gap-2 text-center"><button v-for="year in yearRange" :key="year" type="button" :class="['rounded-lg px-2 py-3 text-sm font-semibold', year === calendarViewDate.getFullYear() ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-100']" @click="selectYear(year)">{{ year }}</button></div>
    </div>
  </div>
</template>
