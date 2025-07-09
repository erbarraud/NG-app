<template>
  <DashboardShell>
    <div class="container mx-auto py-8 px-4 md:px-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold tracking-tight">Orders</h1>
        <Button @click="showCreateForm = true">
          <PlusCircle class="mr-2 h-5 w-5" />
          Schedule New Order
        </Button>
      </div>

      <!-- Create Order Form Modal -->
      <div v-if="showCreateForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Create New Order</h2>
            <Button variant="ghost" size="icon" @click="showCreateForm = false">
              <X class="h-4 w-4" />
            </Button>
          </div>
          <CreateOrderForm @submit="handleOrderSubmit" @cancel="showCreateForm = false" />
        </div>
      </div>

      <!-- Orders List -->
      <OrdersList :orders="orders" @repeat-order="handleRepeatOrder" />
    </div>
  </DashboardShell>
</template>

<script setup>
import { ref } from 'vue'
import DashboardShell from '../components/DashboardShell.vue'
import Button from '../components/ui/Button.vue'
import CreateOrderForm from '../components/CreateOrderForm.vue'
import OrdersList from '../components/OrdersList.vue'
import { PlusCircle, X } from 'lucide-vue-next'

const showCreateForm = ref(false)
const orders = ref([
  {
    id: 'ORD-2025-001',
    name: 'Soft Maple - Monday Shift',
    status: 'Active',
    species: ['Soft Maple'],
    productionDate: '2025-03-18',
    customer: 'ABC Lumber Co.',
    createdAt: '2025-03-18T08:00:00Z'
  },
  {
    id: 'ORD-2025-002',
    name: 'Oak Premium Grade',
    status: 'Pending',
    species: ['Oak'],
    productionDate: '2025-03-19',
    customer: 'Premium Woods Inc.',
    createdAt: '2025-03-17T14:30:00Z'
  }
])

const handleOrderSubmit = (orderData) => {
  const newOrder = {
    ...orderData,
    id: `ORD-${new Date().toISOString().slice(0, 10)}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
  
  orders.value.unshift(newOrder)
  showCreateForm.value = false
}

const handleRepeatOrder = (order) => {
  const newOrder = {
    ...order,
    id: `ORD-${new Date().toISOString().slice(0, 10)}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    name: `${order.name} (Copy)`,
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
  
  orders.value.unshift(newOrder)
}
</script>
