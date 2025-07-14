<template>
  <DashboardShell>
    <template #header>
      <h1 class="text-2xl font-bold text-foreground">Monitor</h1>
    </template>
    <div class="p-4 bg-card rounded-lg shadow-sm">
      <h2 class="text-xl font-semibold">Monitor Page</h2>
      <p class="text-muted-foreground mt-2">This is a placeholder for the Monitor page content. Camera feeds and system health metrics will be displayed here.</p>
    </div>
  </DashboardShell>
</template>

<script setup>
import DashboardShell from '@/components/DashboardShell.vue';
</script>
