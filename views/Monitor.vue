<template>
  <div class="h-full">
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <CameraCard 
        v-for="feed in cameraFeeds" 
        :key="feed.id" 
        :camera-name="feed.name" 
        :image-src="feed.src" 
        :status="feed.status" 
      />
    </div>
  </div>
</template>

<script setup>
import CameraCard from '@/components/monitoring/CameraCard.vue';

const cameraFeeds = [
  { id: 1, name: 'Entry Camera Alpha', src: '/entry-camera-alpha.png', status: 'active' },
  { id: 2, name: 'Scanner Top Rig', src: '/scanner-top-rig.png', status: 'active' },
  { id: 3, name: 'Scanner Bottom Rig', src: '/scanner-bottom-rig.png', status: 'active' },
  { id: 4, name: 'LC Printer Input', src: '/lc_printer_input.png', status: 'active' },
  { id: 5, name: 'LC Scanner Side A', src: '/lc_scanner_side_a.png', status: 'active' },
  { id: 6, name: 'Sorter Input View', src: '/sorter-input-view.png', status: 'inactive' },
  { id: 7, name: 'Sorting Machine Exit', src: '/sorting-machine-exit.png', status: 'error' },
  { id: 8, name: 'Placeholder BMCRS', src: '/placeholder-bmcrs.png', status: 'active' },
];
</script>
