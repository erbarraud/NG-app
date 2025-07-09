<template>
  <div class="flex items-center gap-2 text-sm">
    <div class="flex items-center gap-1.5">
      <div :class="`h-2 w-2 rounded-full ${statusColor}`"></div>
      <span class="font-medium">{{ currentShift.name }}</span>
    </div>
    <div class="text-muted-foreground">
      {{ currentShift.startTime }} - {{ currentShift.endTime }}
    </div>
    <div class="text-muted-foreground">
      ({{ timeRemaining }})
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentTime = ref(new Date())
const currentShift = ref({
  name: 'Day Shift',
  startTime: '08:00',
  endTime: '16:00',
  status: 'active'
})

const statusColor = computed(() => {
  switch (currentShift.value.status) {
    case 'active':
      return 'bg-green-500'
    case 'ending':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
})

const timeRemaining = computed(() => {
  const now = currentTime.value
  const endTime = new Date()
  const [hours, minutes] = currentShift.value.endTime.split(':')
  endTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
  
  const diff = endTime - now
  if (diff <= 0) return 'Ended'
  
  const hoursLeft = Math.floor(diff / (1000 * 60 * 60))
  const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hoursLeft}h ${minutesLeft}m left`
})

let interval = null

onMounted(() => {
  interval = setInterval(() => {
    currentTime.value = new Date()
  }, 60000) // Update every minute
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>
