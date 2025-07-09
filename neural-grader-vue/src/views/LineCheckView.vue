<template>
  <DashboardShell>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">Line Check</h1>
        <div class="flex items-center gap-2">
          <div class="flex border rounded-md overflow-hidden">
            <button
              :class="[
                'px-4 py-2 text-sm font-medium',
                activeTab === 'live-view' ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-muted/50'
              ]"
              @click="activeTab = 'live-view'"
            >
              <ListBulletIcon class="h-4 w-4 inline mr-2" />
              Live View
            </button>
            <button
              :class="[
                'px-4 py-2 text-sm font-medium',
                activeTab === 'scanner' ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-muted/50'
              ]"
              @click="activeTab = 'scanner'"
            >
              <ChartBarIcon class="h-4 w-4 inline mr-2" />
              Scanner
            </button>
          </div>
        </div>
      </div>

      <!-- Live View Tab -->
      <div v-if="activeTab === 'live-view'" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold">Live Scanning View</h2>
            <p class="text-xs text-muted-foreground mt-0.5">Real-time feed from scanner</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1 text-xs">
              <ClockIcon class="h-3 w-3 text-muted-foreground" />
              {{ currentTime }}
            </div>
            <select
              v-model="scanRate"
              class="text-xs border rounded px-1.5 py-0.5 h-7"
              :disabled="isPaused"
            >
              <option v-for="rate in [1, 5, 10, 30, 60, 120]" :key="rate" :value="rate">
                {{ rate }}/min
              </option>
            </select>
            <Button
              variant="outline"
              size="sm"
              @click="togglePause"
              :class="{ 'bg-orange-50': isPaused }"
            >
              <PauseIcon v-if="!isPaused" class="h-3 w-3 mr-1" />
              <PlayIcon v-else class="h-3 w-3 mr-1" />
              {{ isPaused ? "Resume" : "Pause" }}
            </Button>
            <Button
              variant="outline"
              size="sm"
              @click="handleRefresh"
              :class="{ 'animate-pulse': isRefreshing }"
              :disabled="isPaused"
            >
              <ArrowPathIcon class="h-3 w-3 mr-1" :class="{ 'animate-spin': isRefreshing }" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" @click="toggleFullScreen">
              <ArrowsPointingOutIcon class="h-3 w-3 mr-1" />
              Full Screen
            </Button>
          </div>
        </div>

        <Card class="overflow-hidden">
          <CardContent class="p-0 h-full flex flex-col">
            <div class="bg-muted/30 px-3 py-1.5 border-b flex items-center justify-between text-sm">
              <div class="font-medium">Recent Boards</div>
              <div class="text-xs text-muted-foreground">
                {{ autoScrollPaused && "Auto-scroll paused" }}
                {{ isPaused && !autoScrollPaused && "Feed paused" }}
              </div>
            </div>
            <div
              ref="boardListRef"
              class="overflow-y-auto divide-y divide-border max-h-[70vh]"
              @scroll="handleScroll"
            >
              <div
                v-for="(board, index) in boards"
                :key="board.id"
                :class="[
                  'relative w-full overflow-hidden group bg-gray-900 h-32',
                  updatedBoardIds.includes(board.id) && 'ring-2 ring-primary ring-inset',
                  index === 0 && updatedBoardIds.includes(board.id) && 'animate-slide-in-top'
                ]"
              >
                <img
                  :src="board.imageFront || `/placeholder.svg?width=600&height=200&query=board+${board.id}`"
                  :alt="`Board ${board.id}`"
                  class="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-80"
                />
                <div
                  class="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white transition-opacity duration-300"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div class="flex flex-col gap-0.5">
                      <button
                        class="font-semibold text-sm hover:underline flex items-center gap-1.5 w-fit"
                        @click="handleBoardIdClick(board)"
                        :title="`Board ID: ${board.id}`"
                      >
                        <HashtagIcon class="h-4 w-4 flex-shrink-0" />
                        <span class="truncate">{{ board.id }}</span>
                      </button>
                      <div
                        class="flex items-center gap-1.5 text-xs text-gray-200"
                        :title="`Order ID: ${board.batchId}`"
                      >
                        <ArchiveBoxIcon class="h-3.5 w-3.5 flex-shrink-0" />
                        <span class="truncate">{{ board.batchId }}</span>
                      </div>
                    </div>
                    <div class="flex flex-col sm:items-end gap-0.5 mt-1 sm:mt-0">
                      <Badge
                        variant="secondary"
                        class="text-[10px] px-1.5 py-0.5 leading-tight bg-white/20 backdrop-blur-sm text-white border-white/30 w-fit"
                      >
                        {{ board.grade }}
                      </Badge>
                      <div
                        class="flex items-center gap-1 text-xs font-medium"
                        :title="`Value: $${board.value.toFixed(2)}`"
                      >
                        <CurrencyDollarIcon class="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                        <span>${{ board.value.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge
                  v-if="updatedBoardIds.includes(board.id)"
                  variant="default"
                  class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 animate-pulse shadow-lg"
                >
                  New
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div class="p-3 bg-muted/50 rounded-lg border text-xs">
          <div class="flex items-start gap-2">
            <ExclamationCircleIcon class="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p class="text-muted-foreground">
              Live feed with board images (original aspect ratio). KPIs are overlaid. Click Board ID for details.
            </p>
          </div>
        </div>
      </div>

      <!-- Scanner Tab -->
      <div v-if="activeTab === 'scanner'" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold">Camera Monitoring</h2>
            <p class="text-xs text-muted-foreground mt-0.5">Real-time camera status and controls</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1 text-xs">
              <ClockIcon class="h-3 w-3 text-muted-foreground" />
              {{ currentTime }}
            </div>
            <Button
              variant="outline"
              size="sm"
              @click="refreshCameras"
              :class="{ 'animate-pulse': isRefreshingCameras }"
            >
              <ArrowPathIcon class="h-3 w-3 mr-1" :class="{ 'animate-spin': isRefreshingCameras }" />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardContent class="p-3">
            <div class="flex flex-wrap justify-between items-center gap-4">
              <div class="flex items-center gap-x-4 gap-y-2 flex-wrap">
                <div class="flex items-center gap-2" title="Scanner Run Status">
                  <PowerIcon :class="`w-5 h-5 ${scannerOn ? 'text-green-500' : 'text-red-500'}`" />
                  <div class="relative inline-block w-10 h-5 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      class="sr-only"
                      v-model="scannerOn"
                    />
                    <span
                      :class="[
                        'absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-transform',
                        scannerOn ? 'bg-primary transform translate-x-5' : 'bg-gray-400'
                      ]"
                    ></span>
                  </div>
                  <label class="text-sm">Scanner</label>
                </div>
                <div class="flex items-center gap-2" title="Air System Status">
                  <CloudIcon :class="`w-5 h-5 ${airOn ? 'text-blue-500' : 'text-gray-500'}`" />
                  <div class="relative inline-block w-10 h-5 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      class="sr-only"
                      v-model="airOn"
                    />
                    <span
                      :class="[
                        'absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-transform',
                        airOn ? 'bg-primary transform translate-x-5' : 'bg-gray-400'
                      ]"
                    ></span>
                  </div>
                  <label class="text-sm">Air</label>
                </div>
                <div class="flex items-center gap-2" title="Lighting System Status">
                  <LightBulbIcon :class="`w-5 h-5 ${lightsOn ? 'text-yellow-500' : 'text-gray-500'}`" />
                  <div class="relative inline-block w-10 h-5 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      class="sr-only"
                      v-model="lightsOn"
                    />
                    <span
                      :class="[
                        'absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-transform',
                        lightsOn ? 'bg-primary transform translate-x-5' : 'bg-gray-400'
                      ]"
                    ></span>
                  </div>
                  <label class="text-sm">Lights</label>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <Badge
                  :variant="allCamerasConnected ? 'outline' : 'destructive'"
                  :class="allCamerasConnected ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'"
                >
                  <CheckCircleIcon v-if="allCamerasConnected" class="w-4 h-4 mr-1" />
                  <ExclamationTriangleIcon v-else class="w-4 h-4 mr-1" />
                  Cameras: {{ allCamerasConnected ? "All Connected" : "Check Status" }}
                </Badge>
                <Badge
                  :variant="allStreamsHealthy ? 'outline' : 'destructive'"
                  :class="allStreamsHealthy ? 'border-green-300 bg-green-50 text-green-700' : 'border-yellow-300 bg-yellow-50 text-yellow-700'"
                >
                  <CheckCircleIcon v-if="allStreamsHealthy" class="w-4 h-4 mr-1" />
                  <ExclamationTriangleIcon v-else class="w-4 h-4 mr-1" />
                  Streams: {{ allStreamsHealthy ? "All Healthy" : "Check Streams" }}
                </Badge>
                <Badge v-if="activeTriggerRows.length > 0" class="bg-blue-100 text-blue-700 border-blue-300">
                  <BoltIcon class="w-4 h-4 mr-1" />
                  Trigger: Row(s) {{ activeTriggerRows.join(", ") }}
                </Badge>
              </div>
              <Button variant="outline" size="icon" @click="refreshCameras" title="Refresh Data">
                <ArrowPathIcon :class="`h-5 w-5 ${isRefreshingCameras ? 'animate-spin' : ''}`" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Camera rows would go here -->
        <Card v-for="row in cameraRows" :key="row.id" class="bg-card rounded-lg border data-[state=open]:border-primary">
          <div class="hover:no-underline px-4 py-3 text-lg font-medium flex items-center justify-between w-full">
            <div class="flex items-center gap-3">
              <CheckCircleIcon v-if="row.overallStatus === 'operational'" class="w-5 h-5 text-green-600" />
              <ExclamationTriangleIcon v-else-if="row.overallStatus === 'warning'" class="w-5 h-5 text-yellow-600" />
              <XCircleIcon v-else class="w-5 h-5 text-red-600" />
              <span>
                {{ row.name }} [{{ row.cameras.length }} Cameras]
              </span>
              <Badge v-if="row.isGloballyTriggerActive" class="bg-green-100 text-green-700 text-xs border-green-300">
                <BoltIcon class="w-3 h-3 mr-1" />
                Trigger Active
              </Badge>
            </div>
            <div class="flex items-center gap-3">
              <Badge v-if="row.streamingUptime !== undefined" variant="outline" class="text-xs">
                {{ row.streamingUptime }}% Uptime
              </Badge>
              <Button
                size="sm"
                variant="secondary"
                class="text-xs"
                @click.stop="takeSnapshotAllForRow(row.id)"
              >
                <CameraIcon class="w-4 h-4 mr-1" /> Snapshot Row
              </Button>
              <ChevronDownIcon class="h-5 w-5 shrink-0 transition-transform duration-200 text-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { format } from 'date-fns'
import DashboardShell from '@/components/DashboardShell.vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import {
  ListBulletIcon,
  ChartBarIcon,
  ClockIcon,
  PauseIcon,
  PlayIcon,
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  HashtagIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  PowerIcon,
  CloudIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  BoltIcon,
  CameraIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

// State
const activeTab = ref('live-view')
const currentTime = ref(format(new Date(), 'h:mm:ss a'))
const isPaused = ref(false)
const isRefreshing = ref(false)
const autoScrollPaused = ref(false)
const scanRate = ref(5)
const totalScanned = ref(5)
const isFullScreen = ref(false)
const boardListRef = ref<HTMLDivElement | null>(null)
const updatedBoardIds = ref<string[]>([])

// Scanner tab state
const scannerOn = ref(true)
const airOn = ref(true)
const lightsOn = ref(true)
const isRefreshingCameras = ref(false)
const allCamerasConnected = ref(true)
const allStreamsHealthy = ref(true)
const activeTriggerRows = ref(['1', '2'])

// Sample board data
const boards = ref([
  {
    id: "LV-1001",
    timestamp: "15:45:22",
    batchId: "B-789",
    batchName: "Pine Batch 789",
    woodType: "Pine",
    processing: "Kiln Dried",
    dimensions: {
      length: "8'",
      width: '6"',
      thickness: '2"',
    },
    totalSM: "4.0",
    volume: "0.67 ft³",
    value: 12.5,
    grade: "Select",
    status: "active",
    defectCount: 1,
    imageFront: "/board-preview.png",
    imageBack: "/board-preview.png",
    currentFace: 1,
  },
  {
    id: "LV-1002",
    timestamp: "15:46:05",
    batchId: "B-790",
    batchName: "Oak Batch 790",
    woodType: "Oak",
    processing: "Air Dried",
    dimensions: { length: "10'", width: '8"', thickness: '2"' },
    totalSM: "6.7",
    volume: "1.11 ft³",
    value: 18.75,
    grade: "Common",
    status: "active",
    defectCount: 1,
    imageFront: "/board-preview.png",
    imageBack: "/board-preview.png",
    currentFace: 2,
  },
])

// Sample camera rows data
const cameraRows = ref([
  {
    id: "row-1",
    name: "Production Line 1",
    cameras: [
      {
        id: "cam-1-1",
        name: "Entry Camera Alpha",
        label: "1.1 [ENT-A]",
        rowId: "row-1",
        zone: "Entry",
        connectionStatus: "connected",
        streamStatus: "streaming",
        thumbnailUrl: "/entry-camera-alpha.png",
        isTriggerActive: true,
        lastSnapshot: "2025-06-04T16:10:00Z",
      },
      {
        id: "cam-1-2",
        name: "Scanner Top Rig",
        label: "1.2 [SCN-T]",
        rowId: "row-1",
        zone: "Scanner",
        connectionStatus: "connected",
        streamStatus: "streaming",
        thumbnailUrl: "/scanner-top-rig.png",
        isTriggerActive: false,
      },
      // More cameras would be here
    ],
    triggerInfo: "Entry Sensor, Sorter Gate",
    isGloballyTriggerActive: true,
    overallStatus: "warning",
    streamingUptime: 98,
  },
  {
    id: "row-2",
    name: "Production Line 2",
    cameras: [
      {
        id: "cam-2-1",
        name: "Entry Camera Beta",
        label: "2.1 [ENT-B]",
        rowId: "row-2",
        zone: "Entry",
        connectionStatus: "connected",
        streamStatus: "streaming",
        thumbnailUrl: "/placeholder.svg?width=200&height=150",
        isTriggerActive: false,
      },
      // More cameras would be here
    ],
    triggerInfo: "Scanner Beam",
    isGloballyTriggerActive: false,
    overallStatus: "operational",
    streamingUptime: 100,
  },
])

// Methods
const togglePause = () => {
  isPaused.value = !isPaused.value
}

const handleRefresh = () => {
  if (isPaused.value) return
  
  isRefreshing.value = true
  addNewBoard()
  
  setTimeout(() => {
    isRefreshing.value = false
    setTimeout(() => {
      updatedBoardIds.value = []
    }, 1000)
  }, 500)
}

const handleScroll = () => {
  if (!boardListRef.value) return
  autoScrollPaused.value = boardListRef.value.scrollTop > 10
}

const addNewBoard = () => {
  if (isPaused.value) return
  
  // Generate a new board
  const newBoard = {
    id: `LV-${1000 + totalScanned.value + 1}`,
    timestamp: format(new Date(), 'HH:mm:ss'),
    batchId: `B-${Math.floor(Math.random() * 1000)}`,
    batchName: "Pine Batch 789",
    woodType: "Pine",
    processing: "Kiln Dried",
    dimensions: {
      length: "8'",
      width: '6"',
      thickness: '2"',
    },
    totalSM: "4.0",
    volume: "0.67 ft³",
    value: Number.parseFloat((Math.random() * 20 + 5).toFixed(2)),
    grade: Math.random() > 0.5 ? "Select" : "Common",
    status: "active",
    defectCount: Math.floor(Math.random() * 3),
    imageFront: "/board-preview.png",
    imageBack: "/board-preview.png",
    currentFace: Math.random() > 0.5 ? 1 : 2,
  }
  
  boards.value = [newBoard, ...boards.value.slice(0, 199)]
  updatedBoardIds.value = [newBoard.id]
  totalScanned.value++
  
  if (!autoScrollPaused.value && boardListRef.value) {
    boardListRef.value.scrollTop = 0
  }
}

const handleBoardIdClick = (board: any) => {
  // Navigate to board detail
  console.log('Navigate to board detail:', board.id)
}

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  // In a real app, implement actual fullscreen functionality
}

const refreshCameras = () => {
  isRefreshingCameras.value = true
  
  // Simulate data refresh
  setTimeout(() => {
    // Update camera statuses randomly
    cameraRows.value = cameraRows.value.map(row => ({
      ...row,
      cameras: row.cameras.map(cam => ({
        ...cam,
        connectionStatus: Math.random() > 0.8
          ? "warning"
          : (Math.random() > 0.9 ? "disconnected" : "connected"),
        streamStatus: Math.random() > 0.7
          ? "idle"
          : (Math.random() > 0.85 ? "error" : "streaming"),
        isTriggerActive: Math.random() > 0.6
      })),
      isGloballyTriggerActive: Math.random() > 0.5
    }))
    
    // Update global status indicators
    allCamerasConnected.value = cameraRows.value.every(row => 
      row.cameras.every(cam => cam.connectionStatus === "connected")
    )
    
    allStreamsHealthy.value = cameraRows.value.every(row => 
      row.cameras.every(cam => cam.streamStatus === "streaming")
    )
    
    // Update active trigger rows
    activeTriggerRows.value = cameraRows.value
      .filter(row => row.isGloballyTriggerActive)
      .map(row => row.name.split(" ").pop() || "")
    
    isRefreshingCameras.value = false
  }, 1000)
}

const takeSnapshotAllForRow = (rowId: string) => {
  console.log(`Taking snapshot for all cameras in row: ${rowId}`)
  // In a real app, implement actual snapshot functionality
}

// Set up timers
onMounted(() => {
  // Update time every second
  const timeInterval = setInterval(() => {
    currentTime.value = format(new Date(), 'h:mm:ss a')
  }, 1000)
  
  // Add new boards based on scan rate
  const scanInterval = setInterval(() => {
    if (!isPaused.value) {
      isRefreshing.value = true
      addNewBoard()
      setTimeout(() => {
        isRefreshing.value = false
        setTimeout(() => {
          updatedBoardIds.value = []
        }, 1000)
      }, 500)
    }
  }, (60 * 1000) / scanRate.value)
  
  // Clean up on unmount
  onUnmounted(() => {
    clearInterval(timeInterval)
    clearInterval(scanInterval)
  })
})
</script>