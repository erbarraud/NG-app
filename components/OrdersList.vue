<template>
  <div class="space-y-4">
    <!-- Search and Filters -->
    <Card>
      <CardHeader>
        <CardTitle class="text-lg flex items-center">
          <ListFilter class="mr-2 h-5 w-5" />
          Filter & Search Orders
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search by Order ID, Name, Customer..."
            class="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <Button variant="ghost" @click="clearFilters">
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Active & Pending Orders -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Active & Pending Orders</h2>
      <div v-if="activeOrders.length > 0" class="space-y-2">
        <OrderCard
          v-for="order in activeOrders"
          :key="order.id"
          :order="order"
          @repeat="$emit('repeat-order', order)"
        />
      </div>
      <p v-else class="text-muted-foreground text-center py-4">
        No active or pending orders match your filters.
      </p>
    </div>

    <!-- Separator -->
    <div class="border-t my-8"></div>

    <!-- Past Orders -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Past Orders</h2>
      <div v-if="pastOrders.length > 0" class="space-y-2">
        <OrderCard
          v-for="order in pastOrders"
          :key="order.id"
          :order="order"
          :is-past="true"
          @repeat="$emit('repeat-order', order)"
        />
      </div>
      <p v-else class="text-muted-foreground text-center py-4">
        No past orders match your filters.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from './ui/Card.vue'
import CardHeader from './ui/CardHeader.vue'
import CardContent from './ui/CardContent.vue'
import CardTitle from './ui/CardTitle.vue'
import Button from './ui/Button.vue'
import OrderCard from './OrderCard.vue'
import { ListFilter } from 'lucide-vue-next'

const props = defineProps({
  orders: {
    type: Array,
    required: true
  }
})

defineEmits(['repeat-order'])

const searchTerm = ref('')
const statusFilter = ref('')

const filteredOrders = computed(() => {
  return props.orders.filter(order => {
    const matchesSearch = !searchTerm.value || 
      order.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (order.customer && order.customer.toLowerCase().includes(searchTerm.value.toLowerCase()))
    
    const matchesStatus = !statusFilter.value || order.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

const activeOrders = computed(() => {
  return filteredOrders.value.filter(order => 
    order.status === 'Active' || order.status === 'Pending'
  )
})

const pastOrders = computed(() => {
  return filteredOrders.value.filter(order => 
    order.status === 'Completed' || order.status === 'Cancelled'
  )
})

const clearFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
}
</script>
