<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-[280px] justify-start text-left font-normal',
          !date && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <span>{{ date ? format(date.from, 'LLL dd, y') : 'Pick a date' }}</span>
        <span v-if="date && date.to">-</span>
        <span v-if="date && date.to">{{ format(date.to, 'LLL dd, y') }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="date" is-range />
    </PopoverContent>
  </Popover>
</template>

<script setup>
import { ref } from 'vue'
import { format, addDays } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button.vue'
import Calendar from '@/components/ui/Calendar.vue'
import Popover from '@/components/ui/Popover.vue'
import PopoverContent from '@/components/ui/PopoverContent.vue'
import PopoverTrigger from '@/components/ui/PopoverTrigger.vue'

const date = ref({
  from: new Date(),
  to: addDays(new Date(), 7),
})
</script>
