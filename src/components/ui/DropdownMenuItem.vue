<template>
  <MenuItem v-slot="{ active }">
    <button
      :class="[
        active ? 'bg-accent text-accent-foreground' : '',
        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
      ]"
    >
      <slot />
    </button>
  </MenuItem>
</template>

<script setup>
import { MenuItem } from '@headlessui/vue'
</script>
