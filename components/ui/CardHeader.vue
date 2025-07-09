<template>
  <div class="flex flex-col space-y-1.5 p-6" :class="className">
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
