<template>
  <div class="flex h-screen bg-background text-foreground">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header>
        <slot name="header"></slot>
      </Header>
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-muted/10">
        <div class="container mx-auto px-6 py-8">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'
</script>
