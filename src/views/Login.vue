<template>
  <div class="flex flex-col min-h-screen bg-white text-black">
    <header class="flex justify-between items-center p-4 sm:p-6">
      <div class="w-6 h-6">
        <svg viewBox="0 0 75 65" fill="black">
          <path d="M37.59.25l36.95 64H.64l36.95-64z"></path>
        </svg>
      </div>
      <div class="flex items-center space-x-4">
        <a href="#" class="text-sm text-gray-600 hover:text-black">Contact</a>
        <a href="#" class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md">Sign Up</a>
      </div>
    </header>

    <main class="flex-grow flex flex-col items-center justify-center px-4">
      <div class="w-full max-w-sm text-center">
        <h1 class="text-2xl font-bold mb-6">Log in to Vercel</h1>
        
        <form @submit.prevent class="space-y-4">
          <Input type="email" placeholder="Email Address" />
          <Button class="w-full bg-black text-white hover:bg-gray-800">Continue with Email</Button>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-400"></span>
          </div>
        </div>

        <div class="space-y-3">
          <Button variant="outline" class="w-full">
            <GoogleIcon class="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
          <Button variant="outline" class="w-full">
            <GithubIcon class="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
          <Button variant="outline" class="w-full">
            <KeyRound class="mr-2 h-4 w-4" />
            Continue with SAML SSO
          </Button>
           <Button variant="outline" class="w-full">
            <Fingerprint class="mr-2 h-4 w-4" />
            Continue with Passkey
          </Button>
        </div>

        <div class="mt-6">
          <button class="text-sm text-gray-600 hover:text-black">Show other options</button>
        </div>

        <p class="mt-8 text-sm text-gray-600">
          Don't have an account? <a href="#" class="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import GoogleIcon from '@/components/icons/GoogleIcon.vue';
import GithubIcon from '@/components/icons/GithubIcon.vue';
import { KeyRound, Fingerprint } from 'lucide-vue-next';
</script>
