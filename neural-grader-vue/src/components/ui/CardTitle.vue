<template>
  <div :class="['text-2xl font-semibold leading-none tracking-tight', className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>

<script lang="ts">
export default {
  name: 'CardTitle'
}
</script>