<template>
  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-card text-card-foreground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
      <div class="px-1 py-1">
        <slot />
      </div>
    </MenuItems>
  </transition>
</template>

<script setup>
import { MenuItems } from '@headlessui/vue'
</script>
