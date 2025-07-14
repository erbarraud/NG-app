<template>
  <div class="p-3">
    <div class="flex items-center justify-between">
      <Button variant="outline" size="icon" @click="prevMonth">
        <ChevronLeft class="h-4 w-4" />
      </Button>
      <div class="text-sm font-medium">
        {{ monthYear }}
      </div>
      <Button variant="outline" size="icon" @click="nextMonth">
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>
    <div class="grid grid-cols-7 mt-4 text-center text-sm">
      <div v-for="day in weekDays" :key="day" class="text-muted-foreground">{{ day }}</div>
    </div>
    <div class="grid grid-cols-7 mt-2 text-sm">
      <div v-for="day in days" :key="day.date.toISOString()" :class="['p-1', { 'text-center': true }]">
        <button
          @click="selectDate(day.date)"
          :class="[
            'w-9 h-9 rounded-md flex items-center justify-center',
            { 'text-muted-foreground opacity-50': !day.isCurrentMonth },
            { 'bg-primary text-primary-foreground': isSelected(day.date) },
            { 'hover:bg-accent hover:text-accent-foreground': !isSelected(day.date) },
            { 'bg-accent text-accent-foreground': isToday(day.date) && !isSelected(day.date) }
          ]"
        >
          {{ day.date.getDate() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from './Button.vue'

const props = defineProps({
  modelValue: { type: Date, default: null },
})
const emit = defineEmits(['update:modelValue'])

const currentDate = ref(new Date())
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const monthYear = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
})

const days = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startDayOfWeek = firstDayOfMonth.getDay()

  const daysArray = []

  // Days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    daysArray.push({ date: new Date(year, month - 1, prevMonthLastDay - i), isCurrentMonth: false })
  }

  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({ date: new Date(year, month, i), isCurrentMonth: true })
  }

  // Days from next month
  const remainingCells = 42 - daysArray.length // 6 weeks * 7 days
  for (let i = 1; i <= remainingCells; i++) {
    daysArray.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
  }

  return daysArray
})

const selectDate = (date) => {
  emit('update:modelValue', date)
}

const isSelected = (date) => {
  if (!props.modelValue) return false
  return date.toDateString() === props.modelValue.toDateString()
}

const isToday = (date) => {
  return date.toDateString() === new Date().toDateString()
}

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1))
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1))
}
</script>
