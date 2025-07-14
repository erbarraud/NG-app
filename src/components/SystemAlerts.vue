<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">System Alerts</h1>
    <Card>
      <CardHeader>
        <CardTitle>Alert Title</CardTitle>
      </CardHeader>
      <CardContent>
        This is the alert content.
      </CardContent>
      <CardFooter>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Dismiss
        </button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card.vue'
</script>
