<template>
  <aside class="w-64 flex-shrink-0 bg-card border-r border-border">
    <div class="flex flex-col h-full">
      <div class="h-16 flex items-center justify-center border-b border-border">
        <img src="/public/images/neural-grader-logo.png" alt="Logo" class="h-8 w-auto" />
      </div>
      <nav class="flex-1 px-2 py-4 space-y-1">
        <router-link v-for="item in navigation" :key="item.name" :to="item.href"
          :class="[
            $route.path === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
          ]">
          <component :is="item.icon" class="mr-3 h-6 w-6" />
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import {
  LayoutDashboard,
  Package,
  CheckSquare,
  Monitor,
  ClipboardCheck,
  ScanSearch,
  Users,
  Settings,
  AlertTriangle
} from 'lucide-vue-next'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
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
