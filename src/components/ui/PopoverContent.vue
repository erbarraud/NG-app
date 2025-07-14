<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-1 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-1 opacity-0"
  >
    <HPopoverPanel :class="cn('w-72 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-none z-50', $attrs.class)">
      <slot />
    </HPopoverPanel>
  </transition>
</template>

<script setup>
import { PopoverPanel as HPopoverPanel } from '@headlessui/vue'
import { cn } from '@/lib/utils'

defineProps({
  side: {
    type: String,
    default: 'bottom',
  },
})
</script>
