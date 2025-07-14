<template>
  <div id="app" class="min-h-screen bg-background font-sans antialiased">
    <router-view />
  </div>
</template>

<script setup>
import { provide } from 'vue'
import { useTheme } from '@/composables/useTheme'

// Initialize and provide theme for the whole app
const { theme, toggleTheme } = useTheme()
provide('theme', { theme, toggleTheme })
</script>
