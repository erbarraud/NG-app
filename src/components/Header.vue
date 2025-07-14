<template>
  <header class="flex items-center justify-end p-4 h-16 border-b border-border bg-card">
    <div class="flex items-center space-x-4">
      <slot></slot>
      <UserNav />
    </div>
  </header>
</template>

<script setup>
import UserNav from '@/components/UserNav.vue'
</script>
