<template>
  <div class="grid gap-2">
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground')"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          <span>{{ dateRangeText }}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar v-model="date" />
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button.vue'
import Calendar from '@/components/ui/Calendar.vue'
import Popover from '@/components/ui/Popover.vue'
import PopoverTrigger from '@/components/ui/PopoverTrigger.vue'
import PopoverContent from '@/components/ui/PopoverContent.vue'

const date = ref({
  from: new Date(2024, 0, 20),
  to: new Date(2024, 1, 10),
})

// This is a simplified version. A true date range picker would need more logic in the Calendar component.
// For now, we just display a range.
const dateRangeText = computed(() => {
  if (date.value.from) {
    if (date.value.to) {
      return `${format(date.value.from, 'LLL dd, y')} - ${format(date.value.to, 'LLL dd, y')}`
    }
    return format(date.value.from, 'LLL dd, y')
  }
  return 'Pick a date'
})
</script>
