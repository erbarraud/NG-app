<template>
  <Card class="h-full">
    <CardHeader>
      <CardTitle>System Alerts</CardTitle>
      <CardDescription>Recent system notifications and warnings.</CardDescription>
    </CardHeader>
    <CardContent>
      <ul class="space-y-4">
        <li v-for="alert in alerts" :key="alert.id" class="flex items-start">
          <div class="p-2 rounded-full mr-4" :class="alert.type === 'error' ? 'bg-red-500/10' : 'bg-yellow-500/10'">
            <component :is="alert.icon" class="h-5 w-5" :class="alert.type === 'error' ? 'text-red-400' : 'text-yellow-400'" />
          </div>
          <div>
            <p class="font-medium text-sm">{{ alert.message }}</p>
            <p class="text-xs text-muted-foreground">{{ alert.time }}</p>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { AlertTriangle, XCircle } from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

const alerts = ref([
  { id: 1, type: 'error', icon: XCircle, message: 'Camera #3 offline. No image feed.', time: '2 minutes ago' },
  { id: 2, type: 'warning', icon: AlertTriangle, message: 'Line speed dropped to 150 boards/min.', time: '15 minutes ago' },
  { id: 3, type: 'warning', icon: AlertTriangle, message: 'High defect rate detected for knots.', time: '45 minutes ago' },
  { id: 4, type: 'error', icon: XCircle, message: 'Sorter connection lost.', time: '1 hour ago' },
]);
</script>
