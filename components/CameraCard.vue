<template>
  <div class="bg-card border rounded-lg p-3 hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <div :class="`h-2 w-2 rounded-full ${getConnectionStatusColor(camera.connectionStatus)}`"></div>
        <span class="text-sm font-medium">{{ camera.label }}</span>
      </div>
      <Badge :variant="getStreamStatusVariant(camera.streamStatus)" class="text-xs">
        {{ camera.streamStatus }}
      </Badge>
    </div>
    
    <div class="relative mb-3">
      <img
        :src="camera.thumbnailUrl"
        :alt="camera.name"
        class="w-full h-24 object-cover rounded border"
      />
      <div v-if="camera.isTriggerActive" class="absolute top-1 right-1">
        <div class="bg-green-500 text-white rounded-full p-1">
          <Zap class="h-3 w-3" />
        </div>
      </div>
    </div>
    
    <div class="space-y-1 text-xs text-muted-foreground mb-3">
      <div>{{ camera.name }}</div>
      <div>Zone: {{ camera.zone }}</div>
    </div>
    
    <Button
      size="sm"
      variant="outline"
      class="w-full"
      @click="$emit('take-snapshot', camera.id)"
    >
      <Camera class="h-3 w-3 mr-1" />
      Snapshot
    </Button>
  </div>
</template>

<script setup>
import Button from './ui/Button.vue'
import Badge from './ui/Badge.vue'
import { Camera, Zap } from 'lucide-vue-next'

defineProps({
  camera: {
    type: Object,
    required: true
  }
})

defineEmits(['take-snapshot'])

const getConnectionStatusColor = (status) => {
  switch (status) {
    case 'connected':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'disconnected':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const getStreamStatusVariant = (status) => {
  switch (status) {
    case 'streaming':
      return 'default'
    case 'idle':
      return 'secondary'
    case 'error':
      return 'destructive'
    default:
      return 'outline'
  }
}
</script>
