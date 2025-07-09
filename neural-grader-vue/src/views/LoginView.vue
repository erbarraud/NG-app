<template>
  <div class="min-h-screen w-full lg:grid lg:grid-cols-2">
    <!-- Left Panel: Branded Visuals -->
    <div class="relative hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-sky-900 via-slate-900 to-slate-900 text-white p-12 overflow-hidden">
      <!-- Background Pattern Overlay -->
      <div class="absolute inset-0 z-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="techGrid" patternUnits="userSpaceOnUse" width="60" height="60">
              <!-- Grid lines -->
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" stroke-width="0.3" />
              <!-- Dots at intersections -->
              <circle cx="0" cy="0" r="0.7" fill="currentColor" />
              <circle cx="60" cy="0" r="0.7" fill="currentColor" />
              <circle cx="0" cy="60" r="0.7" fill="currentColor" />
              <circle cx="60" cy="60" r="0.7" fill="currentColor" />
            </pattern>
            <!-- Subtle diagonal lines representing scanner light or data flow -->
            <pattern
              id="scanLines"
              patternUnits="userSpaceOnUse"
              width="200"
              height="200"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="200" stroke="currentColor" stroke-width="10" stroke-opacity="0.3" />
              <line x1="50" y1="0" x2="50" y2="200" stroke="currentColor" stroke-width="5" stroke-opacity="0.2" />
              <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" stroke-width="10" stroke-opacity="0.3" />
              <line x1="150" y1="0" x2="150" y2="200" stroke="currentColor" stroke-width="5" stroke-opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#scanLines)" opacity="0.3" />
          <rect width="100%" height="100%" fill="url(#techGrid)" />
        </svg>
      </div>

      <!-- Abstract shapes for depth - optional -->
      <div class="absolute -top-20 -left-20 w-72 h-72 bg-sky-700/30 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
      <div class="absolute -bottom-20 -right-10 w-96 h-96 bg-sky-600/30 rounded-full filter blur-3xl opacity-40 animate-pulse-slower"></div>

      <div class="relative z-10 flex flex-col items-center text-center max-w-md">
        <router-link to="/" class="mb-10">
          <img
            src="/images/neural-grader-logo.png"
            alt="Neural Grader Logo"
            class="mx-auto filter brightness-0 invert"
            style="width: 240px; height: auto;"
          />
        </router-link>
        <h1 class="text-4xl font-bold mb-4 leading-tight">Unlock Precision. Maximize Value.</h1>
        <p class="text-lg text-sky-100/80 mb-12">Neural Grader: AI-powered insights for the timber industry.</p>
      </div>
      <p class="absolute bottom-8 text-sm text-sky-100/60 z-10">
        © {{ currentYear }} Neural Grader. All rights reserved.
      </p>
    </div>

    <!-- Right Panel: Login Form -->
    <div class="flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-950">
      <!-- Mobile Header -->
      <div class="lg:hidden mb-8 text-center">
        <router-link to="/">
          <img
            src="/images/neural-grader-logo.png"
            alt="Neural Grader Logo"
            class="mx-auto dark:filter dark:brightness-0 dark:invert"
            style="width: 180px; height: auto;"
          />
        </router-link>
      </div>

      <div class="w-full max-w-md space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-xl shadow-2xl">
        <div>
          <h2 class="text-3xl font-bold text-slate-800 dark:text-white">Welcome Back</h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-1.5">
            <label for="email" class="text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <Input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              placeholder="you@example.com"
              class="h-11 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800/50"
            />
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="password" class="text-slate-700 dark:text-slate-300">
                Password
              </label>
            </div>
            <div class="relative">
              <Input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                placeholder="••••••••"
                class="h-11 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800/50 pr-10"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <input
                id="remember-me"
                type="checkbox"
                v-model="rememberMe"
                class="h-4 w-4 rounded border-slate-400 dark:border-slate-600 text-primary focus:ring-primary"
              />
              <label for="remember-me" class="font-normal text-slate-600 dark:text-slate-400">
                Remember me
              </label>
            </div>
            <router-link to="#" class="font-medium text-primary hover:text-primary/80 hover:underline">
              Forgot Password?
            </router-link>
          </div>

          <div>
            <Button
              type="submit"
              class="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              :loading="isLoading"
            >
              <template #leftIcon>
                <ArrowRightOnRectangleIcon class="h-5 w-5" />
              </template>
              Login
            </Button>
          </div>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-slate-300 dark:border-slate-700" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <Button
            variant="outline"
            class="w-full h-11 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <template #leftIcon>
              <ComputerDesktopIcon class="h-5 w-5" />
            </template>
            Login with Google
          </Button>
        </div>

        <p class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?
          <router-link to="#" class="font-medium text-primary hover:text-primary/80 hover:underline">
            Create account
          </router-link>
        </p>
      </div>
      <p class="lg:hidden mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        © {{ currentYear }} Neural Grader. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
  ComputerDesktopIcon
} from '@heroicons/vue/24/outline'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const handleLogin = () => {
  isLoading.value = true
  
  // Simulate API call
  setTimeout(() => {
    console.log('Login attempt with:', { email: email.value, password: password.value, rememberMe: rememberMe.value })
    isLoading.value = false
    router.push('/')
  }, 1000)
}
</script>