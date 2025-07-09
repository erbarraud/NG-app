<template>
  <div class="space-y-3">
    <div
      v-for="alert in alerts"
      :key="alert.title"
      :class="`flex items-start gap-4 rounded-lg border-l-4 border p-3 hover:bg-muted/50 ${getBorderColor(alert.type)}`"
    >
      <div :class="getIconColor(alert.type)">
        <AlertTriangle v-if="alert.type === 'warning'" class="h-5 w-5" />
        <FileText v-else class="h-5 w-5" />
      </div>
      <div class="space-y-1">
        <p class="text-sm font-medium">{{ alert.title }}</p>
        <p class="text-sm text-muted-foreground">{{ alert.description }}</p>
        <div class="flex items-center pt-1">
          <Clock class="mr-1 h-3 w-3 text-muted-foreground" />
          <span class="text-xs text-muted-foreground">{{ alert.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle, FileText, Clock } from 'lucide-vue-next'

defineProps({
  alerts: {
    type: Array,
    required: true
  }
})

const getBorderColor = (type) => {
  switch (type) {
    case 'warning':
      return 'border-l-amber-500'
    case 'info':
      return 'border-l-blue-500'
    default:
      return 'border-l-gray-500'
  }
}

const getIconColor = (type) => {
  switch (type) {
    case 'warning':
      return 'text-amber-500'
    case 'info':
      return 'text-blue-500'
    default:
      return 'text-gray-500'
  }
}
</script>
