<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2">Order ID</label>
        <input
          v-model="formData.orderId"
          type="text"
          placeholder="e.g., ORD-20250605-001"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Order Name</label>
        <input
          v-model="formData.orderName"
          type="text"
          placeholder="e.g., Soft Maple - Monday Shift"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">Species</label>
      <select
        v-model="formData.species"
        class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        required
      >
        <option value="">Select species</option>
        <option value="Soft Maple">Soft Maple</option>
        <option value="Hard Maple">Hard Maple</option>
        <option value="Oak">Oak</option>
        <option value="Beech">Beech</option>
        <option value="Walnut">Walnut</option>
        <option value="Spruce/Fir">Spruce/Fir</option>
      </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2">Production Date</label>
        <input
          v-model="formData.productionDate"
          type="date"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Dry Status</label>
        <select
          v-model="formData.dryStatus"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          required
        >
          <option value="">Select dry status</option>
          <option value="Kiln Dried">Kiln Dried</option>
          <option value="Air Dried">Air Dried</option>
          <option value="Green">Green</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2">Shift (Optional)</label>
        <select
          v-model="formData.productionShift"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select shift</option>
          <option value="Day Shift">Day Shift</option>
          <option value="Night Shift">Night Shift</option>
          <option value="Weekend Shift">Weekend Shift</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Customer (Optional)</label>
        <input
          v-model="formData.customer"
          type="text"
          placeholder="Enter customer name"
          class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>

    <div class="flex justify-end space-x-2 pt-4 border-t">
      <Button type="button" variant="outline" @click="$emit('cancel')">
        Cancel
      </Button>
      <Button type="submit" :loading="isSubmitting">
        {{ isSubmitting ? 'Creating...' : 'Create Order' }}
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Button from './ui/Button.vue'

const emit = defineEmits(['submit', 'cancel'])

const isSubmitting = ref(false)
const formData = reactive({
  orderId: '',
  orderName: '',
  species: '',
  dryStatus: '',
  productionDate: '',
  productionShift: '',
  customer: ''
})

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('submit', { ...formData })
    
    // Reset form
    Object.keys(formData).forEach(key => {
      formData[key] = ''
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
