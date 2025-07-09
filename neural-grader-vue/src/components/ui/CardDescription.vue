<template>
  <div :class="['text-sm text-muted-foreground', className]">
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
  name: 'CardDescription'
}
</script>