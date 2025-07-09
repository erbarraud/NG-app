<template>
  <h3 class="text-2xl font-semibold leading-none tracking-tight" :class="className">
    <slot />
  </h3>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>
