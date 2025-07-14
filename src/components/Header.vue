<template>
  <header class="flex items-center justify-between p-4 h-16 border-b border-border bg-card">
    <div class="flex items-center">
      <slot name="header"></slot>
    </div>
    <div class="flex items-center space-x-4">
      <UserNav />
    </div>
  </header>
</template>

<script setup>
import UserNav from '@/components/UserNav.vue'
</script>
