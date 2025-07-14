<template>
  <Card>
    <CardHeader>
      <CardTitle>Shift Status</CardTitle>
      <CardDescription>Live production overview</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="flex justify-between items-center">
        <span class="text-muted-foreground">Current Shift</span>
        <span class="font-semibold">Day Shift (6am - 6pm)</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-muted-foreground">Line Speed</span>
        <span class="font-semibold">180 boards/min</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-muted-foreground">Uptime</span>
        <span class="font-semibold text-green-400">98.7%</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-muted-foreground">Total Boards</span>
        <span class="font-semibold">45,721</span>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
</script>
