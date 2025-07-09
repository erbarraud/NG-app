<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b">
          <th class="text-left p-4 font-medium">Order ID</th>
          <th class="text-left p-4 font-medium">Date</th>
          <th class="text-left p-4 font-medium">Start Time</th>
          <th class="text-left p-4 font-medium">End Time</th>
          <th class="text-left p-4 font-medium">Status</th>
          <th class="text-left p-4 font-medium">Volume</th>
          <th class="text-left p-4 font-medium">Yield</th>
          <th class="text-right p-4 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" class="border-b hover:bg-muted/50">
          <td class="p-4 font-medium">{{ order.id }}</td>
          <td class="p-4">{{ order.date }}</td>
          <td class="p-4">{{ order.startTime }}</td>
          <td class="p-4">
            <span v-if="order.endTime === 'In progress'" class="text-sm text-muted-foreground">
              {{ order.endTime }}
            </span>
            <span v-else>{{ order.endTime }}</span>
          </td>
          <td class="p-4">
            <div class="flex items-center gap-1.5">
              <div :class="`h-2 w-2 rounded-full ${getStatusColor(order.status)}`"></div>
              <span class="text-sm font-medium">{{ order.status }}</span>
            </div>
          </td>
          <td class="p-4">{{ order.volume }}</td>
          <td class="p-4">{{ order.yield }}</td>
          <td class="p-4 text-right">
            <Button variant="ghost" size="icon" @click="handleOrderAction(order)">
              <MoreHorizontal class="h-4 w-4" />
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import Button from './ui/Button.vue'
import { MoreHorizontal } from 'lucide-vue-next'

defineProps({
  orders: {
    type: Array,
    required: true
  }
})

const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-500'
    case 'Completed':
      return 'bg-gray-500'
    default:
      return 'bg-blue-500'
  }
}

const handleOrderAction = (order) => {
  console.log('Order action:', order)
}
</script>
