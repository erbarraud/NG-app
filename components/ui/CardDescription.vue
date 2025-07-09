<template>
  <p class="text-sm text-muted-foreground" :class="className">
    <slot />
  </p>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>
