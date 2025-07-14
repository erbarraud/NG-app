<template>
  <div class="flex items-center space-x-4">
    <button @click="toggleTheme" class="p-2 rounded-full hover:bg-muted">
      <Sun v-if="theme === 'light'" class="h-5 w-5" />
      <Moon v-else class="h-5 w-5" />
    </button>
    <div class="relative">
      <button @click="menuOpen = !menuOpen" class="flex items-center space-x-2">
        <img class="h-8 w-8 rounded-full" src="/placeholder-user.jpg" alt="User avatar" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'

const menuOpen = ref(false)
const { theme, toggleTheme } = inject('theme')
</script>
