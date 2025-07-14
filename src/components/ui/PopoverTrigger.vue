<template>
  <HPopoverButton as="template">
    <slot />
  </HPopoverButton>
</template>

<script setup>
import { PopoverButton as HPopoverButton } from '@headlessui/vue'
</script>
