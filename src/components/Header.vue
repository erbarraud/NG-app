<template>
  <header class="flex items-center justify-between p-4 border-b border-border bg-card">
    <h1 class="text-xl font-bold">Neural Grader</h1>
    <div class="flex items-center space-x-4">
      <button @click="toggleTheme" class="p-2 rounded-full hover:bg-muted">
        <Sun v-if="theme === 'light'" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </button>
      <div class="flex items-center space-x-2">
        <img src="/placeholder-user.jpg" alt="User Avatar" class="h-8 w-8 rounded-full">
        <span class="text-sm font-medium">Operator</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { inject } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'

const { theme, toggleTheme } = inject('theme')
</script>
