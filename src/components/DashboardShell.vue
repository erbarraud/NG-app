<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar can be added here -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header can be added here -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800">
        <div class="container mx-auto px-6 py-8">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
// This component can be expanded to include a sidebar and header.
</script>
