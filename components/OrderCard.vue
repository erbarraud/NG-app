<template>
  <Card class="hover:shadow-md transition-shadow">
    <CardContent class="p-4">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="font-semibold">{{ order.name }}</h3>
            <Badge :variant="getStatusVariant(order.status)">
              {{ order.status }}
            </Badge>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div>
              <span class="font-medium">Order ID:</span> {{ order.id }}
            </div>
            <div>
              <span class="font-medium">Species:</span> {{ order.species.join(', ') }}
            </div>
            <div>
              <span class="font-medium">Date:</span> {{ formatDate(order.productionDate) }}
            </div>
            <div v-if="order.customer">
              <span class="font-medium">Customer:</span> {{ order.customer }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button
            v-if="isPast"
            variant="outline"
            size="sm"
            @click="$emit('repeat', order)"
          >
            <RotateCcw class="h-4 w-4 mr-1" />
            Repeat
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import Card from './ui/Card.vue'
import CardContent from './ui/CardContent.vue'
import Button from './ui/Button.vue'
import Badge from './ui/Badge.vue'
import { MoreHorizontal, RotateCcw } from 'lucide-vue-next'

defineProps({
  order: {
    type: Object,
    required: true
  },
  isPast: {
    type: Boolean,
    default: false
  }
})

defineEmits(['repeat'])

const getStatusVariant = (status) => {
  switch (status) {
    case 'Active':
      return 'default'
    case 'Pending':
      return 'secondary'
    case 'Completed':
      return 'outline'
    case 'Cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}
</script>
