<template>
  <DashboardShell>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold tracking-tight">Production Orders</h1>
      <router-link to="/orders/new">
        <Button>
          <PlusCircleIcon class="mr-2 h-4 w-4" />
          Schedule New Order
        </Button>
      </router-link>
    </div>
    
    <div class="space-y-6">
      <!-- Placeholder for production orders view -->
      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
          <CardDescription>Currently running and scheduled production orders</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-muted-foreground">No active orders found. Click "Schedule New Order" to create one.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Past Orders</CardTitle>
          <CardDescription>Completed and archived production orders</CardDescription>
        </CardHeader>
        <CardContent>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left p-2">Order ID</th>
                <th class="text-left p-2">Date</th>
                <th class="text-left p-2">Species</th>
                <th class="text-left p-2">Status</th>
                <th class="text-left p-2">Volume</th>
                <th class="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in pastOrders" :key="order.id" class="border-t hover:bg-muted/50">
                <td class="p-2 font-medium">{{ order.id }}</td>
                <td class="p-2">{{ order.date }}</td>
                <td class="p-2">{{ order.species }}</td>
                <td class="p-2">
                  <Badge :variant="order.status === 'Completed' ? 'default' : 'destructive'">
                    {{ order.status }}
                  </Badge>
                </td>
                <td class="p-2">{{ order.volume }}</td>
                <td class="p-2 text-right">
                  <Button variant="ghost" size="sm">
                    <EyeIcon class="h-4 w-4" />
                    <span class="sr-only">View</span>
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardShell from '@/components/DashboardShell.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { PlusCircleIcon, EyeIcon } from '@heroicons/vue/24/outline'

// Sample data for past orders
const pastOrders = ref([
  {
    id: 'B-4872',
    date: 'Mar 18, 2025',
    species: 'Red Oak',
    status: 'Completed',
    volume: '12.6 m³'
  },
  {
    id: 'B-4871',
    date: 'Mar 18, 2025',
    species: 'White Oak',
    status: 'Completed',
    volume: '9.9 m³'
  },
  {
    id: 'B-4870',
    date: 'Mar 17, 2025',
    species: 'Maple',
    status: 'Cancelled',
    volume: '0 m³'
  }
])
</script>