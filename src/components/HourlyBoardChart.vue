<template>
  <Card>
    <CardHeader>
      <CardTitle>Hourly Production</CardTitle>
      <CardDescription>Boards graded per hour over the last 8 hours.</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="h-64 flex items-end space-x-2">
        <div v-for="bar in data" :key="bar.hour" class="flex-1 flex flex-col items-center">
          <div class="w-full bg-primary rounded-t-md" :style="{ height: `${(bar.boards / maxBoards) * 100}%` }"></div>
          <span class="text-xs mt-1 text-muted-foreground">{{ bar.hour }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'

const data = ref([
  { hour: '8am', boards: 890 },
  { hour: '9am', boards: 1100 },
  { hour: '10am', boards: 1250 },
  { hour: '11am', boards: 1210 },
  { hour: '12pm', boards: 950 },
  { hour: '1pm', boards: 1300 },
  { hour: '2pm', boards: 1280 },
  { hour: '3pm', boards: 1150 },
])

const maxBoards = computed(() => Math.max(...data.value.map(item => item.boards)))
</script>
