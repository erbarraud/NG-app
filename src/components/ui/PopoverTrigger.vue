<template>
  <HPopoverButton as="template">
    <slot></slot>
  </HPopoverButton>
</template>

<script setup>
import { PopoverButton as HPopoverButton } from '@headlessui/vue'
</script>
