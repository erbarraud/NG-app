<template>
  <DashboardShell>
    <div class="flex flex-col gap-6 w-full">
      <!-- Header with controls -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Board Finder</h1>
          <p class="text-muted-foreground">Find and analyze boards as they move through the scanning line</p>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <Card>
        <CardContent class="p-4">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="relative flex-grow">
              <MagnifyingGlassIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search boards by ID, batch, or grade..."
                class="pl-9 w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                v-model="searchQuery"
              />
              <button
                v-if="searchQuery"
                class="absolute right-1 top-1 h-7 w-7 flex items-center justify-center hover:bg-muted rounded-md"
                @click="searchQuery = ''"
              >
                <XMarkIcon class="h-4 w-4" />
              </button>
            </div>

            <div class="flex gap-2">
              <div class="relative">
                <Button variant="outline" class="flex gap-2">
                  <FunnelIcon class="h-4 w-4" />
                  <span>Filters</span>
                  <Badge v-if="activeFilters > 0" variant="secondary" class="ml-1 px-1.5 py-0.5 h-5">
                    {{ activeFilters }}
                  </Badge>
                </Button>
              </div>

              <select
                class="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="3">Show 3</option>
                <option value="5">Show 5</option>
                <option value="10">Show 10</option>
                <option value="20">Show 20</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Timeline Navigator (Collapsed by default) -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between py-3 cursor-pointer"
          @click="isTimelineExpanded = !isTimelineExpanded"
        >
          <h4 class="text-lg font-semibold">Timeline Navigator</h4>
          <Button variant="ghost" size="icon">
            <ChevronDownIcon v-if="!isTimelineExpanded" class="h-5 w-5" />
            <ChevronUpIcon v-else class="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent v-if="isTimelineExpanded" class="p-4 pt-0">
          <!-- Timeline content would go here -->
          <div class="h-24 bg-muted/30 rounded-md flex items-center justify-center">
            Timeline visualization placeholder
          </div>
        </CardContent>
      </Card>

      <!-- Search Results Summary -->
      <div v-if="filteredBoards.length > 0" class="flex justify-between items-center">
        <p class="text-sm text-muted-foreground">
          Showing {{ (currentPage * boardsPerPage) + 1 }}-{{ Math.min((currentPage + 1) * boardsPerPage, filteredBoards.length) }} of {{ filteredBoards.length }} boards
        </p>

        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            @click="goToPrevPage"
            :disabled="currentPage === 0"
          >
            <ChevronLeftIcon class="h-4 w-4 mr-1" /> Previous
          </Button>
          <div class="text-sm">
            Page {{ currentPage + 1 }} of {{ totalPages }}
          </div>
          <Button
            variant="outline"
            size="sm"
            @click="goToNextPage"
            :disabled="currentPage >= totalPages - 1"
          >
            Next <ChevronRightIcon class="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      <div v-else class="text-center p-8 bg-muted/20 rounded-lg">
        <p class="text-muted-foreground">No boards match your search criteria</p>
        <Button variant="outline" class="mt-4" @click="clearFilters">
          Clear Filters
        </Button>
      </div>

      <!-- Board Results -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <!-- Board List (Sidebar) -->
        <div class="lg:col-span-1 space-y-2 order-2 lg:order-1">
          <Card
            v-for="board in paginatedBoards"
            :key="board.id"
            :class="[
              'cursor-pointer hover:border-primary transition-colors',
              selectedBoard?.id === board.id ? 'border-primary border-2' : ''
            ]"
            @click="selectBoard(board.id)"
          >
            <CardContent class="p-2">
              <div class="flex justify-between items-center mb-1">
                <span class="font-medium text-sm truncate" :title="board.id">
                  {{ board.id }}
                </span>
                <Badge variant="outline" class="text-xs px-1.5 py-0.5">
                  {{ board.grade }}
                </Badge>
              </div>
              <div class="text-xs text-muted-foreground truncate" :title="`Batch ID: ${board.batchId}`">
                Batch: {{ board.batchId }}
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Selected Board Detail -->
        <div class="lg:col-span-4 order-1 lg:order-2">
          <Card v-if="selectedBoard" class="border-primary border-2 shadow-md">
            <CardContent class="p-4">
              <!-- Board info header -->
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-3">
                  <h2 class="text-xl font-semibold">Board {{ selectedBoard.id }}</h2>
                  <Badge variant="outline">
                    {{ selectedBoard.grade }}
                  </Badge>
                </div>
              </div>

              <hr class="my-4" />

              <!-- Board metadata -->
              <div class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                <div v-for="(item, index) in metadataItems" :key="index" class="bg-muted/40 p-3 rounded-lg shadow-sm">
                  <div class="flex items-center text-xs text-muted-foreground mb-1">
                    <component :is="item.icon" class="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                    {{ item.label }}
                  </div>
                  <div class="text-sm font-semibold text-foreground truncate" :title="String(item.value)">
                    {{ item.value }}
                  </div>
                </div>
              </div>

              <!-- Board images -->
              <div class="space-y-6">
                <!-- Face 1 -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium">Face 1</span>
                    <div v-if="face1DefectCount > 0" class="flex items-center gap-1.5">
                      <div :class="`h-2 w-2 rounded-full ${face1DefectCount > 2 ? 'bg-red-500' : face1DefectCount > 1 ? 'bg-amber-500' : 'bg-blue-500'}`"></div>
                      <span class="text-xs font-medium">{{ face1DefectCount }} defects</span>
                    </div>
                    <div v-else class="flex items-center gap-1.5">
                      <div class="h-2 w-2 rounded-full bg-green-500"></div>
                      <span class="text-xs font-medium">No defects</span>
                    </div>
                  </div>
                  <div class="relative border rounded-md overflow-hidden" style="height: 200px">
                    <img
                      :src="selectedBoard.imageFront || '/placeholder.svg'"
                      :alt="`Board ${selectedBoard.id} front view`"
                      class="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <!-- Face 2 -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium">Face 2</span>
                    <div v-if="face2DefectCount > 0" class="flex items-center gap-1.5">
                      <div :class="`h-2 w-2 rounded-full ${face2DefectCount > 2 ? 'bg-red-500' : face2DefectCount > 1 ? 'bg-amber-500' : 'bg-blue-500'}`"></div>
                      <span class="text-xs font-medium">{{ face2DefectCount }} defects</span>
                    </div>
                    <div v-else class="flex items-center gap-1.5">
                      <div class="h-2 w-2 rounded-full bg-green-500"></div>
                      <span class="text-xs font-medium">No defects</span>
                    </div>
                  </div>
                  <div class="relative border rounded-md overflow-hidden" style="height: 200px">
                    <img
                      :src="selectedBoard.imageBack || '/placeholder.svg'"
                      :alt="`Board ${selectedBoard.id} back view`"
                      class="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter class="border-t p-3 flex justify-end">
              <Button variant="default" size="sm" @click="viewFullInspection(selectedBoard.id)">
                Full Inspection
              </Button>
            </CardFooter>
          </Card>
          <Card v-else class="p-8 text-center">
            <p class="text-muted-foreground">Select a board to view details</p>
          </Card>
        </div>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DashboardShell from '@/components/DashboardShell.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import CardFooter from '@/components/ui/CardFooter.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  RectangleGroupIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ExclamationCircleIcon,
  PercentIcon
} from '@heroicons/vue/24/outline'

// Router
const router = useRouter()

// State
const searchQuery = ref('')
const isTimelineExpanded = ref(false)
const activeFilters = ref(0)
const currentPage = ref(0)
const boardsPerPage = ref(3)
const selectedBoardId = ref<string | null>(null)

// Sample board data
interface Board {
  id: string
  timestamp: string
  batchId: string
  batchName: string
  woodType: string
  processing: string
  dimensions: {
    length: string
    width: string
    thickness: string
  }
  totalSM: string
  volume: string
  value: number
  grade: string
  status: string
  defectCount: number
  defects?: Array<{
    type: string
    count: number
    position: { x: number; y: number }
    severity: string
    face: number
  }>
  imageFront: string
  imageBack?: string
}

const boards: Board[] = [
  {
    id: "BRD-4625",
    timestamp: "03/18/2025 3:58 PM",
    batchId: "B-4873",
    batchName: "Red Oak 4/4 Premium",
    woodType: "Red Oak",
    processing: "Kiln Dried",
    dimensions: {
      length: "8' 3 3/4\"",
      width: '5 1/2"',
      thickness: '15/16"',
    },
    totalSM: "4 sqft",
    volume: "4 bf",
    value: 4.9,
    grade: "1COMMON",
    status: "active",
    defectCount: 2,
    defects: [
      { type: "Wane", count: 1, position: { x: 120, y: 45 }, severity: "Minor", face: 1 },
      { type: "Wane", count: 3, position: { x: 350, y: 10 }, severity: "Moderate", face: 2 },
    ],
    imageFront: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oihta9wWaQYaEFvC1z9VjpuUjbSOVa.png",
    imageBack: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-drLAyRSs2uQvu389RmxAczDmZgmVjX.png",
  },
  {
    id: "BRD-58920",
    timestamp: "03/18/2025 3:41 PM",
    batchId: "B-4873",
    batchName: "Red Oak 4/4 Premium",
    woodType: "Red Oak",
    processing: "Kiln Dried",
    dimensions: {
      length: "8' 3 3/4\"",
      width: '5 1/2"',
      thickness: '15/16"',
    },
    totalSM: "4 sqft",
    volume: "4 bf",
    value: 4.9,
    grade: "1COMMON",
    status: "active",
    defectCount: 3,
    defects: [
      { type: "Split", count: 1, position: { x: 200, y: 30 }, severity: "Major", face: 1 },
      { type: "Knot", count: 3, position: { x: 450, y: 25 }, severity: "Minor", face: 2 },
      { type: "Knot", count: 2, position: { x: 520, y: 40 }, severity: "Minor", face: 1 },
    ],
    imageFront: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oihta9wWaQYaEFvC1z9VjpuUjbSOVa.png",
    imageBack: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-drLAyRSs2uQvu389RmxAczDmZgmVjX.png",
  },
  {
    id: "BRD-58919",
    timestamp: "03/18/2025 3:41 PM",
    batchId: "B-4873",
    batchName: "Red Oak 4/4 Premium",
    woodType: "Red Oak",
    processing: "Kiln Dried",
    dimensions: {
      length: "8' 3 3/4\"",
      width: '5 1/2"',
      thickness: '15/16"',
    },
    totalSM: "4 sqft",
    volume: "4 bf",
    value: 4.9,
    grade: "1COMMON",
    status: "active",
    defectCount: 3,
    defects: [
      { type: "Hole", count: 1, position: { x: 300, y: 35 }, severity: "Major", face: 1 },
      { type: "Split", count: 3, position: { x: 100, y: 20 }, severity: "Major", face: 2 },
      { type: "Wane", count: 2, position: { x: 600, y: 15 }, severity: "Severe", face: 1 },
    ],
    imageFront: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oihta9wWaQYaEFvC1z9VjpuUjbSOVa.png",
    imageBack: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-drLAyRSs2uQvu389RmxAczDmZgmVjX.png",
  },
  {
    id: "BRD-58918",
    timestamp: "03/18/2025 3:40 PM",
    batchId: "B-4873",
    batchName: "Red Oak 4/4 Premium",
    woodType: "Red Oak",
    processing: "Kiln Dried",
    dimensions: {
      length: "8' 3 3/4\"",
      width: '5 1/2"',
      thickness: '15/16"',
    },
    totalSM: "4 sqft",
    volume: "4 bf",
    value: 4.9,
    grade: "1COMMON",
    status: "processed",
    defectCount: 0,
    defects: [],
    imageFront: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oihta9wWaQYaEFvC1z9VjpuUjbSOVa.png",
    imageBack: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-drLAyRSs2uQvu389RmxAczDmZgmVjX.png",
  },
  {
    id: "BRD-58917",
    timestamp: "03/18/2025 3:40 PM",
    batchId: "B-4873",
    batchName: "Red Oak 4/4 Premium",
    woodType: "Red Oak",
    processing: "Kiln Dried",
    dimensions: {
      length: "8' 3 3/4\"",
      width: '5 1/2"',
      thickness: '15/16"',
    },
    totalSM: "4 sqft",
    volume: "4 bf",
    value: 4.9,
    grade: "1COMMON",
    status: "processed",
    defectCount: 2,
    defects: [
      { type: "Knot", count: 1, position: { x: 250, y: 50 }, severity: "Moderate", face: 1 },
      { type: "Wane", count: 3, position: { x: 700, y: 5 }, severity: "Minor", face: 2 },
    ],
    imageFront: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oihta9wWaQYaEFvC1z9VjpuUjbSOVa.png",
    imageBack: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-drLAyRSs2uQvu389RmxAczDmZgmVjX.png",
  }
]

// Computed properties
const filteredBoards = computed(() => {
  return boards.filter(board => {
    return board.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           board.batchId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           board.grade.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredBoards.value.length / boardsPerPage.value)
})

const paginatedBoards = computed(() => {
  const startIndex = currentPage.value * boardsPerPage.value
  return filteredBoards.value.slice(startIndex, startIndex + boardsPerPage.value)
})

const selectedBoard = computed(() => {
  return selectedBoardId.value 
    ? boards.find(board => board.id === selectedBoardId.value) 
    : paginatedBoards.value[0]
})

const face1DefectCount = computed(() => {
  return selectedBoard.value?.defects?.filter(d => d.face === 1).length || 0
})

const face2DefectCount = computed(() => {
  return selectedBoard.value?.defects?.filter(d => d.face === 2).length || 0
})

// Metadata items for the selected board
const metadataItems = computed(() => {
  if (!selectedBoard.value) return []
  
  return [
    {
      label: "Length",
      value: selectedBoard.value.dimensions.length,
      icon: RectangleGroupIcon
    },
    {
      label: "Width",
      value: selectedBoard.value.dimensions.width,
      icon: RectangleGroupIcon
    },
    {
      label: "Thickness",
      value: selectedBoard.value.dimensions.thickness,
      icon: RectangleGroupIcon
    },
    {
      label: "Volume",
      value: selectedBoard.value.volume,
      icon: CubeIcon
    },
    {
      label: "Value",
      value: `$${selectedBoard.value.value.toFixed(2)}`,
      icon: CurrencyDollarIcon
    },
    {
      label: "Total Defects",
      value: selectedBoard.value.defectCount,
      icon: ExclamationCircleIcon
    }
  ]
})

// Methods
const selectBoard = (boardId: string) => {
  selectedBoardId.value = boardId
}

const clearFilters = () => {
  searchQuery.value = ''
  activeFilters.value = 0
}

const goToPrevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

const viewFullInspection = (boardId: string) => {
  router.push(`/board-finder?boardId=${boardId}`)
}
</script>