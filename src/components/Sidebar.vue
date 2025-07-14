<template>
  <aside class="w-64 flex-shrink-0 bg-card border-r border-border flex flex-col">
    <div class="h-16 flex items-center justify-center border-b border-border px-4">
      <img src="/images/neural-grader-logo.png" alt="Logo" class="h-8 w-auto" />
      <h1 class="text-lg font-semibold ml-2 text-foreground">Neural Grader</h1>
    </div>
    <nav class="flex-1 px-4 py-4 space-y-1">
      <router-link v-for="item in navigation" :key="item.name" :to="item.href"
        :class="[
          $route.path === item.href ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
        ]">
        <component :is="item.icon" class="mr-3 h-5 w-5" />
        {{ item.name }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import {
  LayoutDashboard, Package, CheckSquare, Monitor, ClipboardCheck, ScanSearch, Users, Settings, AlertTriangle
} from 'lucide-vue-next'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: Package },
  { name: 'Line Check', href: '/line-check', icon: CheckSquare },
  { name: 'Monitor', href: '/monitor', icon: Monitor },
  { name: 'Grading', href: '/grading', icon: ClipboardCheck },
  { name: 'Defects', href: '/defects', icon: AlertTriangle },
  { name: 'Board Finder', href: '/board-finder', icon: ScanSearch },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Integrations', href: '/integrations', icon: Settings },
]
</script>
