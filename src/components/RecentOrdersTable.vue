<template>
  <Card>
    <CardHeader>
      <CardTitle>Recent Orders</CardTitle>
      <CardDescription>A list of the most recent production orders.</CardDescription>
    </CardHeader>
    <CardContent>
      <table class="w-full text-sm text-left">
        <thead class="text-xs text-muted-foreground uppercase">
          <tr>
            <th class="py-2 px-4">Order ID</th>
            <th class="py-2 px-4">Customer</th>
            <th class="py-2 px-4">Status</th>
            <th class="py-2 px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="border-b">
            <td class="py-2 px-4 font-medium">{{ order.id }}</td>
            <td class="py-2 px-4">{{ order.customer }}</td>
            <td class="py-2 px-4">
              <Badge :variant="order.status === 'Completed' ? 'default' : 'secondary'"
                :class="{ 'bg-green-500 text-white': order.status === 'Completed', 'bg-yellow-500 text-white': order.status === 'In Progress' }">
                {{ order.status }}
              </Badge>
            </td>
            <td class="py-2 px-4">{{ order.date }}</td>
          </tr>
        </tbody>
      </table>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'

const orders = ref([
  { id: '#ORD-2024-0012', customer: 'Lumber Co.', status: 'In Progress', date: '2024-07-14' },
  { id: '#ORD-2024-0011', customer: 'BuildMart', status: 'Completed', date: '2024-07-13' },
  { id: '#ORD-2024-0010', customer: 'Home Supply', status: 'Completed', date: '2024-07-13' },
  { id: '#ORD-2024-0009', customer: 'Lumber Co.', status: 'Completed', date: '2024-07-12' },
])
</script>
