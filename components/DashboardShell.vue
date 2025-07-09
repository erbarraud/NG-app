<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="flex h-16 items-center border-b px-6">
          <img src="/images/neural-grader-logo.png" alt="Neural Grader" class="h-8 w-auto" />
          <span class="ml-2 text-lg font-semibold">Neural Grader</span>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 space-y-1 px-3 py-4">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            class="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            :class="{ 'bg-accent text-accent-foreground': $route.path === item.href }"
          >
            <component :is="item.icon" class="mr-3 h-5 w-5" />
            {{ item.name }}
          </router-link>
        </nav>

        <!-- User Profile -->
        <div class="border-t p-4">
          <div class="flex items-center">
            <img class="h-8 w-8 rounded-full" src="/user-avatar-mockup.jpg" alt="User" />
            <div class="ml-3">
              <p class="text-sm font-medium">John Operator</p>
              <p class="text-xs text-muted-foreground">Shift Lead</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="pl-64">
      <div class="px-6 py-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Home,
  Package,
  Camera,
  BarChart3,
  Settings,
  Users,
  AlertTriangle,
  FileText,
  Layers
} from 'lucide-vue-next'

const route = useRoute()

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Orders', href: '/batches', icon: Package },
  { name: 'Line Check', href: '/line-check', icon: Camera },
  { name: 'Monitor', href: '/monitor', icon: BarChart3 },
  { name: 'Grading', href: '/grading', icon: Layers },
  { name: 'Defects', href: '/defects', icon: AlertTriangle },
  { name: 'Board Finder', href: '/board-finder', icon: FileText },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/integrations', icon: Settings }
]
</script>
