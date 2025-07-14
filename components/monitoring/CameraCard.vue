<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">{{ cameraName }}</CardTitle>
      <StatusIndicator :status="status" />
    </CardHeader>
    <CardContent>
      <div class="relative aspect-video w-full overflow-hidden rounded-md">
        <img
          :src="imageSrc"
          :alt="`Live feed from ${cameraName}`"
          class="absolute h-full w-full object-cover"
        />
      </div>
      <div class="mt-2 flex items-center justify-end">
        <Badge :variant="statusMap[status].variant">
          {{ statusMap[status].text }}
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusIndicator from '@/components/StatusIndicator.vue';

defineProps({
  cameraName: String,
  imageSrc: String,
  status: String, // 'active', 'inactive', 'error'
});

const statusMap = {
  active: { text: 'Active', variant: 'default' },
  inactive: { text: 'Inactive', variant: 'secondary' },
  error: { text: 'Error', variant: 'destructive' },
};
</script>
