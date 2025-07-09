<template>
  <div class="flex min-h-screen w-full flex-col">
    <!-- Fixed Header -->
    <header
      class="sticky top-0 z-50 w-full border-b bg-secondary text-secondary-foreground transition-shadow"
      :class="{ 'shadow-sm': isScrolled }"
      style="border-bottom-color: #4ED586"
    >
      <!-- Top bar with logo and actions -->
      <div class="flex h-14 items-center justify-between px-4 lg:px-6">
        <!-- Left: Logo and mobile menu -->
        <div class="flex items-center gap-4">
          <router-link to="/" class="flex items-center gap-2">
            <img
              src="/images/neural-grader-logo.png"
              alt="Neural Grader"
              class="h-8 w-auto filter brightness-0 invert"
            />
          </router-link>

          <!-- Mobile menu button -->
          <button
            class="lg:hidden"
            @click="toggleMobileMenu"
            aria-label="Toggle navigation menu"
            :aria-expanded="isMobileMenuOpen"
          >
            <MenuIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- Center: Desktop navigation -->
        <nav class="hidden lg:flex items-center space-x-1">
          <!-- Main navigation items -->
          <router-link
            v-for="item in mainNavItems"
            :key="item.href"
            :to="item.href"
            :class="[
              'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              $route.path === item.href
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-secondary/80'
            ]"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span>{{ item.label }}</span>
          </router-link>

          <!-- Tools dropdown -->
          <div class="relative" v-click-outside="closeToolsDropdown">
            <button
              class="h-9 px-3 text-sm font-medium flex items-center gap-1.5"
              @click="toggleToolsDropdown"
            >
              Tools
              <ChevronDownIcon class="ml-1 h-4 w-4" />
            </button>
            <div
              v-if="isToolsDropdownOpen"
              class="absolute left-0 top-full mt-1 w-48 rounded-md border bg-popover p-1 shadow-lg"
            >
              <router-link
                v-for="item in toolsNavItems"
                :key="item.href"
                :to="item.href"
                class="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                <component :is="item.icon" class="h-4 w-4" />
                <span>{{ item.label }}</span>
              </router-link>
            </div>
          </div>

          <!-- Support dropdown -->
          <div class="relative" v-click-outside="closeSupportDropdown">
            <button
              class="h-9 px-3 text-sm font-medium flex items-center gap-1.5"
              @click="toggleSupportDropdown"
            >
              Support
              <ChevronDownIcon class="ml-1 h-4 w-4" />
            </button>
            <div
              v-if="isSupportDropdownOpen"
              class="absolute left-0 top-full mt-1 w-48 rounded-md border bg-popover p-1 shadow-lg"
            >
              <router-link
                to="/support"
                class="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                <QuestionMarkCircleIcon class="h-4 w-4" />
                <span>Help & Documentation</span>
              </router-link>
            </div>
          </div>
        </nav>

        <!-- Right: Actions -->
        <div class="flex items-center gap-3">
          <!-- Notifications -->
          <div class="relative" v-click-outside="closeNotificationsDropdown">
            <button
              class="relative"
              @click="toggleNotificationsDropdown"
              aria-label="Notifications"
            >
              <BellIcon class="h-4 w-4" />
              <span
                v-if="notificationCount > 0"
                class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive p-0 text-[10px] text-destructive-foreground"
              >
                {{ notificationCount }}
              </span>
            </button>
            <div
              v-if="isNotificationsDropdownOpen"
              class="absolute right-0 top-full mt-1 w-80 rounded-md border bg-popover p-1 shadow-lg"
            >
              <div class="px-2 py-1.5 font-medium">Recent Notifications</div>
              <div class="h-px bg-muted my-1"></div>
              <div
                v-for="(notification, index) in notifications"
                :key="index"
                class="px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
              >
                {{ notification }}
              </div>
            </div>
          </div>

          <!-- User menu -->
          <div class="relative" v-click-outside="closeUserDropdown">
            <button
              class="rounded-full"
              @click="toggleUserDropdown"
              aria-label="User account menu"
            >
              <div class="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span class="text-sm font-medium">JD</span>
              </div>
            </button>
            <div
              v-if="isUserDropdownOpen"
              class="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover p-1 shadow-lg"
            >
              <div class="px-2 py-1.5 font-medium">
                <div class="flex flex-col">
                  <span class="font-medium">John Doe</span>
                  <span class="text-xs text-muted-foreground">Administrator</span>
                </div>
              </div>
              <div class="h-px bg-muted my-1"></div>
              <button class="w-full text-left flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                <CogIcon class="h-4 w-4" />
                <span>Account Settings</span>
              </button>
              <button class="w-full text-left flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-red-600">
                <ArrowRightOnRectangleIcon class="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile navigation -->
      <nav v-if="isMobileMenuOpen" class="lg:hidden border-t border-border bg-background">
        <div class="grid grid-cols-2 gap-1 p-2">
          <!-- All navigation items in mobile grid -->
          <router-link
            v-for="item in [...mainNavItems, ...toolsNavItems, ...configNavItems]"
            :key="item.href"
            :to="item.href"
            :class="[
              'flex items-center gap-2 p-2 text-sm rounded-md transition-colors',
              $route.path === item.href ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/80'
            ]"
            @click="closeMobileMenu"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span>{{ item.label }}</span>
          </router-link>
          <router-link
            to="/support"
            :class="[
              'flex items-center gap-2 p-2 text-sm rounded-md transition-colors',
              $route.path === '/support' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/80'
            ]"
            @click="closeMobileMenu"
          >
            <QuestionMarkCircleIcon class="h-4 w-4" />
            <span>Help & Documentation</span>
          </router-link>
        </div>

        <!-- Mobile search -->
        <div class="p-2 pt-0">
          <form class="relative">
            <MagnifyingGlassIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search boards, orders..."
              class="w-full pl-8 shadow-none h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </form>
        </div>
      </nav>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-900/50">
      <div class="container mx-auto p-4 sm:p-6">
        <slot />
      </div>
    </main>

    <!-- Application Footer -->
    <footer class="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2024 Neural Grader. Built for precision lumber grading.
            </p>
          </div>
          <div class="flex items-center space-x-4 text-sm text-muted-foreground">
            <router-link to="/terms" class="hover:text-foreground transition-colors">
              Terms
            </router-link>
            <div class="h-4 border-l border-muted-foreground/20"></div>
            <router-link to="/privacy" class="hover:text-foreground transition-colors">
              Privacy
            </router-link>
            <div class="h-4 border-l border-muted-foreground/20"></div>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Bars3Icon as MenuIcon,
  BellIcon,
  ChevronDownIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  DocumentTextIcon,
  MagnifyingGlassCircleIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  Cog6ToothIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

// Navigation state
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const notificationCount = ref(3)
const notifications = ref([
  'Batch #1234 completed with 95% accuracy',
  'System update scheduled for tomorrow',
  'New grading rule added by Admin'
])

// Dropdown states
const isToolsDropdownOpen = ref(false)
const isSupportDropdownOpen = ref(false)
const isNotificationsDropdownOpen = ref(false)
const isUserDropdownOpen = ref(false)

// Navigation items
const mainNavItems = [
  { href: '/', icon: HomeIcon, label: 'Overview' },
  { href: '/batches', icon: DocumentTextIcon, label: 'Orders' },
  { href: '/board-finder', icon: MagnifyingGlassCircleIcon, label: 'Board Finder' },
  { href: '/line-check', icon: ChartBarIcon, label: 'Line' }
]

const toolsNavItems = [
  { href: '/tools/claims', icon: ClipboardDocumentCheckIcon, label: 'Claims' },
  { href: '/tools/shift-scheduler', icon: CalendarIcon, label: 'Shift Scheduler' }
]

const configNavItems = [
  { href: '/grading', icon: Cog6ToothIcon, label: 'Grading Rules' },
  { href: '/users', icon: UserGroupIcon, label: 'User Management' }
]

// Mobile menu handlers
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Dropdown handlers
const toggleToolsDropdown = () => {
  isToolsDropdownOpen.value = !isToolsDropdownOpen.value
  isSupportDropdownOpen.value = false
  isNotificationsDropdownOpen.value = false
  isUserDropdownOpen.value = false
}

const closeToolsDropdown = () => {
  isToolsDropdownOpen.value = false
}

const toggleSupportDropdown = () => {
  isSupportDropdownOpen.value = !isSupportDropdownOpen.value
  isToolsDropdownOpen.value = false
  isNotificationsDropdownOpen.value = false
  isUserDropdownOpen.value = false
}

const closeSupportDropdown = () => {
  isSupportDropdownOpen.value = false
}

const toggleNotificationsDropdown = () => {
  isNotificationsDropdownOpen.value = !isNotificationsDropdownOpen.value
  isToolsDropdownOpen.value = false
  isSupportDropdownOpen.value = false
  isUserDropdownOpen.value = false
}

const closeNotificationsDropdown = () => {
  isNotificationsDropdownOpen.value = false
}

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value
  isToolsDropdownOpen.value = false
  isSupportDropdownOpen.value = false
  isNotificationsDropdownOpen.value = false
}

const closeUserDropdown = () => {
  isUserDropdownOpen.value = false
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el._clickOutside = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutside)
  }
}

// Handle scroll effect for header shadow
onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 10
  }

  window.addEventListener('scroll', handleScroll)
  
  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<script lang="ts">
export default {
  directives: {
    'click-outside': {
      mounted(el: HTMLElement, binding: any) {
        el._clickOutside = (event: MouseEvent) => {
          if (!(el === event.target || el.contains(event.target as Node))) {
            binding.value(event)
          }
        }
        document.addEventListener('click', el._clickOutside)
      },
      unmounted(el: HTMLElement) {
        document.removeEventListener('click', el._clickOutside)
      }
    }
  }
}
</script>