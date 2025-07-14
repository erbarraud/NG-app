<template>
  <Card>
    <CardHeader>
      <CardTitle>Shift Status</CardTitle>
      <CardDescription>Current production shift overview.</CardDescription>
    </CardHeader>
    <CardContent class="grid grid-cols-2 gap-4">
      <div class="flex flex-col items-center p-4 bg-muted rounded-lg">
        <span class="text-sm font-medium text-muted-foreground">Boards/Hour</span>
        <span class="text-3xl font-bold">1,234</span>
      </div>
      <div class="flex flex-col items-center p-4 bg-muted rounded-lg">
        <span class="text-sm font-medium text-muted-foreground">Uptime</span>
        <span class="text-3xl font-bold text-green-500">98.7%</span>
      </div>
      <div class="col-span-2">
        <p class="text-sm"><span class="font-semibold">Current Order:</span> #ORD-2024-0012</p>
        <p class="text-sm"><span class="font-semibold">Shift:</span> Day Shift (6:00 AM - 6:00 PM)</p>
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
