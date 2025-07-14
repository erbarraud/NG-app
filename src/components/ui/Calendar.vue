<template>
  <div :class="cn('p-3', $attrs.class)">
    <div class="flex items-center justify-between pt-1 pb-2">
      <button @click="prevMonth" :disabled="!canGoPrev" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0 opacity-50 hover:opacity-100">
        <ChevronLeft class="h-4 w-4" />
      </button>
      <div class="text-sm font-medium">
        {{ monthName }} {{ year }}
      </div>
      <button @click="nextMonth" :disabled="!canGoNext" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0 opacity-50 hover:opacity-100">
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
    <div class="grid grid-cols-7 gap-y-2 text-center text-sm text-muted-foreground">
      <div v-for="day in weekdays" :key="day">{{ day }}</div>
    </div>
    <div class="grid grid-cols-7 gap-1 mt-2">
      <div v-for="day in days" :key="day.date.toISOString()" :class="cn('text-center text-sm p-0 relative', day.isCurrentMonth ? '' : 'text-muted-foreground opacity-50')">
        <button @click="selectDate(day.date)" :class="cn('h-9 w-9 p-0 font-normal', { 'bg-primary text-primary-foreground rounded-md': isSelected(day.date), 'bg-accent rounded-md': isToday(day.date) && !isSelected(day.date), 'hover:bg-accent rounded-md': !isSelected(day.date) })">
          {{ day.date.getDate() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isToday as checkIsToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: {
    type: Date,
    default: null,
  },
  canGoPrev: {
    type: Boolean,
    default: true,
  },
  canGoNext: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const currentDate = ref(props.modelValue || new Date())
const monthName = computed(() => format(currentDate.value, 'MMMM'))
const year = computed(() => format(currentDate.value, 'yyyy'))
const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const days = computed(() => {
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)
  const monthDays = eachDayOfInterval({ start, end })

  const firstDayOfMonth = getDay(start)
  const prevMonthPadding = Array.from({ length: firstDayOfMonth }, (_, i) => {
    const date = subMonths(start, 1)
    return { date: new Date(date.getFullYear(), date.getMonth(), start.getDate() - firstDayOfMonth + i), isCurrentMonth: false }
  })

  return [
    ...prevMonthPadding.map(d => ({ date: d.date, isCurrentMonth: false })),
    ...monthDays.map(date => ({ date, isCurrentMonth: true }))
  ]
})

function prevMonth() {
  currentDate.value = subMonths(currentDate.value, 1)
}

function nextMonth() {
  currentDate.value = addMonths(currentDate.value, 1)
}

function selectDate(date) {
  emit('update:modelValue', date)
}

function isSelected(date) {
  return props.modelValue && isSameDay(date, props.modelValue)
}

function isToday(date) {
  return checkIsToday(date)
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    currentDate.value = newVal
  }
})
</script>
