<template>
  <Card>
    <CardHeader>
      <CardTitle>System Alerts</CardTitle>
      <CardDescription>Important notifications and system status.</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div v-for="alert in alerts" :key="alert.id" class="flex items-start space-x-3">
        <AlertTriangle :class="['h-5 w-5 mt-0.5', alert.type === 'warning' ? 'text-yellow-500' : 'text-red-500']" />
        <div>
          <p class="text-sm font-medium">{{ alert.title }}</p>
          <p class="text-sm text-muted-foreground">{{ alert.message }}</p>
        </div>
      </div>
      <div v-if="alerts.length === 0" class="text-sm text-muted-foreground text-center py-4">
        <CheckCircle class="h-6 w-6 mx-auto text-green-500 mb-2" />
        No system alerts. Everything is running smoothly.
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { AlertTriangle, CheckCircle } from 'lucide-vue-next'

const alerts = ref([
  { id: 1, type: 'warning', title: 'Camera C-04 Offline', message: 'Upstream scanner camera C-04 is not responding.' },
  { id: 2, type: 'error', title: 'Sorter Bin #7 Full', message: 'Bin #7 has reached capacity and requires clearing.' },
])
</script>
