<template>
  <DashboardShell>
    <div class="space-y-6">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <ShiftStatusDisplay />
        </div>
        <div class="lg:col-span-2">
          <HourlyBoardChart />
        </div>
        <div class="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <div class="lg:col-span-1">
          <SystemAlerts />
        </div>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup>
import DashboardShell from '@/components/DashboardShell.vue'
import ShiftStatusDisplay from '@/components/ShiftStatusDisplay.vue'
import HourlyBoardChart from '@/components/HourlyBoardChart.vue'
import RecentOrdersTable from '@/components/RecentOrdersTable.vue'
import SystemAlerts from '@/components/SystemAlerts.vue'
</script>
