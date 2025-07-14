<template>
  <HPopover class="relative">
    <slot></slot>
  </HPopover>
</template>

<script setup>
import { Popover as HPopover } from '@headlessui/vue'
</script>
