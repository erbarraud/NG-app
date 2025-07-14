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
        <span class="font-semibold text-green-500">98.7%</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-muted-foreground">Total Boards</span>
        <span class="font-semibold">45,721</span>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
</script>
