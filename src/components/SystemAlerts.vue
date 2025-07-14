<template>
 <Card>
   <CardHeader>
     <CardTitle>System Alerts</CardTitle>
     <CardDescription>Recent system notifications and warnings.</CardDescription>
   </CardHeader>
   <CardContent class="space-y-3">
     <div v-for="alert in alerts" :key="alert.id" class="flex items-start space-x-3">
       <component :is="alert.icon" :class="['h-5 w-5 mt-0.5', alert.color]" />
       <div>
         <p class="text-sm font-medium">{{ alert.message }}</p>
         <p class="text-xs text-muted-foreground">{{ alert.time }}</p>
       </div>
     </div>
   </CardContent>
 </Card>
</template>

<script setup>
import { ref } from 'vue'
import { AlertTriangle, CheckCircle, Info } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card.vue'

const alerts = ref([
 { id: 1, icon: AlertTriangle, message: 'Scanner #3 requires calibration.', time: '2 min ago', color: 'text-yellow-500' },
 { id: 2, icon: CheckCircle, message: 'Shift changeover complete.', time: '1 hour ago', color: 'text-green-500' },
 { id: 3, icon: Info, message: 'Software update scheduled for 2am.', time: '3 hours ago', color: 'text-blue-500' },
])
</script>
