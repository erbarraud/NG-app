<template>
  <DashboardShell>
    <template #header>
      <h1 class="text-2xl font-bold text-foreground">Dashboard</h1>
      <DateRangePicker />
    </template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ShiftStatusDisplay />
      <HourlyBoardChart />
      <RecentOrdersTable />
      <SystemAlerts />
    </div>
  </DashboardShell>
</template>

<script setup>
import DashboardShell from '@/components/DashboardShell.vue'
import DateRangePicker from '@/components/DateRangePicker.vue'
import ShiftStatusDisplay from '@/components/ShiftStatusDisplay.vue'
import HourlyBoardChart from '@/components/HourlyBoardChart.vue'
import RecentOrdersTable from '@/components/RecentOrdersTable.vue'
import SystemAlerts from '@/components/SystemAlerts.vue'
</script>
