<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-1 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-1 opacity-0"
  >
    <HPopoverPanel
      class="absolute z-10 mt-3 w-screen max-w-sm transform px-4 sm:px-0 lg:max-w-3xl"
      :class="[
        side === 'left' ? 'right-0' : '',
        side === 'right' ? 'left-0' : '',
        side === 'top' ? 'bottom-full mb-2' : '',
        side === 'bottom' ? 'top-full mt-2' : '',
      ]"
    >
      <div
        class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <div class="relative bg-white p-4">
          <slot></slot>
        </div>
      </div>
    </HPopoverPanel>
  </transition>
</template>

<script setup>
import { PopoverPanel as HPopoverPanel } from '@headlessui/vue'

defineProps({
  side: {
    type: String,
    default: 'bottom',
  },
})
</script>
