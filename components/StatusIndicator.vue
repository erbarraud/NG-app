<template>
  <span :class="['h-3 w-3 rounded-full', statusClasses[status], className]" />
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['active', 'inactive', 'error'].includes(value),
  },
  className: {
    type: String,
    default: '',
  },
});

const statusClasses = {
  active: 'bg-green-500',
  inactive: 'bg-gray-400',
  error: 'bg-red-500',
};
</script>
