<template>
  <div :class="['flex items-center p-6 pt-0', className]">
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
  name: 'CardFooter'
}
</script>