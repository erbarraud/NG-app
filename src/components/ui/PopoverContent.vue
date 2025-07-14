<template>
  <HPopoverPanel class="absolute z-10 mt-2 w-screen max-w-sm px-4 sm:px-0">
    <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
      <div class="relative bg-card p-4">
        <slot></slot>
      </div>
    </div>
  </HPopoverPanel>
</template>

<script setup>
import { PopoverPanel as HPopoverPanel } from '@headlessui/vue'
</script>
