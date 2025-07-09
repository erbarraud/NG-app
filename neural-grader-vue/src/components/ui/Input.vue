<template>
  <div v-if="leftIcon || rightIcon" class="relative">
    <div v-if="leftIcon" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
      <slot name="leftIcon" />
    </div>
    <input
      :class="[
        'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-destructive focus-visible:ring-destructive',
        leftIcon && 'pl-10',
        rightIcon && 'pr-10',
        className
      ]"
      v-bind="$attrs"
    />
    <div v-if="rightIcon" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
      <slot name="rightIcon" />
    </div>
  </div>
  <input
    v-else
    :class="[
      'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      error && 'border-destructive focus-visible:ring-destructive',
      className
    ]"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
defineProps({
  error: {
    type: Boolean,
    default: false
  },
  leftIcon: {
    type: Boolean,
    default: false
  },
  rightIcon: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>