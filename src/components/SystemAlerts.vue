<template>
  <Card>
    <CardHeader>
      <CardTitle>System Alerts</CardTitle>
      <CardDescription>Recent system notifications and warnings.</CardDescription>
    </CardHeader>
    <CardContent>
      <ul class="space-y-4">
        <li v-for="alert in alerts" :key="alert.id" class="flex items-start">
          <div class="p-2 bg-muted rounded-full mr-3">
            <component :is="alert.icon" :class="['h-5 w-5', alert.color]" />
          </div>
          <div>
            <p class="text-sm font-medium">{{ alert.message }}</p>
            <p class="text-xs text-muted-foreground">{{ alert.time }}</p>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { AlertTriangle, CheckCircle, Info } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'

const alerts = ref([
  { id: 1, icon: AlertTriangle, message: 'Camera 3 offline', time: '2 minutes ago', color: 'text-yellow-500' },
  { id: 2, icon: CheckCircle, message: 'System software updated successfully', time: '1 hour ago', color: 'text-green-500' },
  { id: 3, icon: Info, message: 'Scheduled maintenance at 2 AM', time: '3 hours ago', color: 'text-blue-500' },
  { id: 4, icon: AlertTriangle, message: 'Sorter bin #7 full', time: '5 hours ago', color: 'text-yellow-500' },
])
</script>
