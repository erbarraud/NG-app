<template>
  <div class="flex items-center p-6 pt-0" :class="className">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>
