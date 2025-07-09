<template>
  <DashboardShell>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Line Check Camera Monitoring</h1>
          <p class="text-muted-foreground">Real-time camera status and controls for line check stations</p>
        </div>
        <div class="flex items-center gap-2">
          <div :class="`h-2 w-2 rounded-full ${refreshing ? 'animate-pulse bg-green-500' : 'bg-green-500'}`"></div>
          <span class="text-sm text-muted-foreground">Live</span>
          <div class="text-sm text-muted-foreground ml-4">{{ currentTime }}</div>
        </div>
      </div>

      <!-- System Controls -->
      <Card>
        <CardContent class="p-4">
          <div class="flex flex-wrap justify-between items-center gap-4">
            <div class="flex items-center gap-x-4 gap-y-2 flex-wrap">
              <div class="flex items-center gap-2">
                <PowerIcon :class="`w-5 h-5 ${scannerOn ? 'text-green-500' : 'text-red-500'}`" />
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="scannerOn"
                    type="checkbox"
                    class="sr-only"
                  />
                  <div :class="`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${scannerOn ? 'bg-primary' : 'bg-gray-200'}`">
                    <span :class="`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${scannerOn ? 'translate-x-6' : 'translate-x-1'}`" />
                  </div>
                  <span class="ml-2 text-sm">Scanner</span>
                </label>
              </div>
              <div class="flex items-center gap-2">
                <Wind :class="`w-5 h-5 ${airOn ? 'text-blue-500' : 'text-gray-500'}`" />
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="airOn"
                    type="checkbox"
                    class="sr-only"
                  />
                  <div :class="`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${airOn ? 'bg-primary' : 'bg-gray-200'}`">
                    <span :class="`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${airOn ? 'translate-x-6' : 'translate-x-1'}`" />
                  </div>
                  <span class="ml-2 text-sm">Air</span>
                </label>
              </div>
              <div class="flex items-center gap-2">
                <Lightbulb :class="`w-5 h-5 ${lightsOn ? 'text-yellow-500' : 'text-gray-500'}`" />
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="lightsOn"
                    type="checkbox"
                    class="sr-only"
                  />
                  <div :class="`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lightsOn ? 'bg-primary' : 'bg-gray-200'}`">
                    <span :class="`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${lightsOn ? 'translate-x-6' : 'translate-x-1'}`" />
                  </div>
                  <span class="ml-2 text-sm">Lights</span>
                </label>
              </div>
            </div>
            <Button variant="outline" size="icon" @click="handleRefresh">
              <RefreshCw :class="`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Camera Rows -->
      <div class="space-y-4">
        <div
          v-for="row in cameraRows"
          :key="row.id"
          class="bg-card rounded-lg border"
        >
          <div class="p-4 border-b">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <CheckCircle v-if="row.overallStatus === 'operational'" class="w-5 h-5 text-green-600" />
                <AlertTriangle v-else-if="row.overallStatus === 'warning'" class="w-5 h-5 text-yellow-600" />
                <XCircle v-else class="w-5 h-5 text-red-600" />
                <h3 class="text-lg font-medium">{{ row.name }} [{{ row.cameras.length }} Cameras]</h3>
                <Badge v-if="row.isGloballyTriggerActive" class="bg-green-100 text-green-700 text-xs border-green-300">
                  <Zap class="w-3 h-3 mr-1" />
                  Trigger Active
                </Badge>
              </div>
              <div class="flex items-center gap-3">
                <Badge v-if="row.streamingUptime" variant="outline" class="text-xs">
                  {{ row.streamingUptime }}% Uptime
                </Badge>
                <Button size="sm" variant="secondary" @click="takeSnapshotAllForRow(row.id)">
                  <ImageIcon class="w-4 h-4 mr-1" />
                  Snapshot Row
                </Button>
              </div>
            </div>
          </div>
          <div class="p-4">
            <p class="text-sm text-muted-foreground mb-4">Trigger Info: {{ row.triggerInfo }}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <CameraCard
                v-for="camera in row.cameras"
                :key="camera.id"
                :camera="camera"
                @take-snapshot="takeSnapshot"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DashboardShell from '../components/DashboardShell.vue'
import Card from '../components/ui/Card.vue'
import CardContent from '../components/ui/CardContent.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import CameraCard from '../components/CameraCard.vue'
import {
  PowerIcon,
  Wind,
  Lightbulb,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  ImageIcon
} from 'lucide-vue-next'

const currentTime = ref('')
const refreshing = ref(false)
const scannerOn = ref(true)
const airOn = ref(true)
const lightsOn = ref(true)

const cameraRows = ref([
  {
    id: 'lc-row-1',
    name: 'Line Check Row 1',
    cameras: [
      {
        id: 'lc-cam-1-1',
        name: 'LC Entry Top',
        label: 'LC1.1 [ENT-T]',
        zone: 'Entry',
        connectionStatus: 'connected',
        streamStatus: 'streaming',
        thumbnailUrl: '/ornate-entryway.png',
        isTriggerActive: true
      },
      {
        id: 'lc-cam-1-2a',
        name: 'LC Scanner Top',
        label: 'LC1.2a [SCN-T]',
        zone: 'Scanner',
        connectionStatus: 'connected',
        streamStatus: 'streaming',
        thumbnailUrl: '/camera-placeholder-boards.png',
        isTriggerActive: false
      }
    ],
    triggerInfo: 'Entry Sensor, Sorter Gate',
    isGloballyTriggerActive: true,
    overallStatus: 'operational',
    streamingUptime: 97
  }
])

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const handleRefresh = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
  }, 1500)
}

const takeSnapshot = (cameraId) => {
  console.log(`Taking snapshot for camera: ${cameraId}`)
}

const takeSnapshotAllForRow = (rowId) => {
  console.log(`Taking snapshot for all cameras in row: ${rowId}`)
}

let timeInterval = null

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
