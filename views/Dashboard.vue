<template>
  <DashboardShell>
    <div class="flex flex-col gap-6 w-full">
      <!-- Main Dashboard Header -->
      <Card class="overflow-hidden border shadow-sm">
        <CardHeader class="py-4 px-6 border-b">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h1 class="text-2xl font-bold tracking-tight">Neural Grader Dashboard</h1>
              <p class="text-sm text-muted-foreground">
                Monitor lumber grading operations, track performance, and manage quality control
              </p>
            </div>
            <div class="flex items-center gap-2">
              <ShiftStatusDisplay />
              <Button
                variant="outline"
                size="sm"
                @click="handleExtendShift"
                class="h-8 px-2.5 bg-transparent"
              >
                <PlusCircle class="h-3.5 w-3.5 mr-1.5" />
                Extend
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent class="p-0">
          <div class="grid lg:grid-cols-12 gap-0">
            <!-- KPI Section -->
            <div class="lg:col-span-4 xl:col-span-3 border-r border-border bg-slate-50/50 dark:bg-slate-900/20">
              <div class="grid grid-cols-1 divide-y">
                <div class="p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/30 transition-colors">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <div class="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-md">
                        <DollarSign class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span class="font-medium text-sm">Value Processed</span>
                    </div>
                  </div>
                  <div class="flex items-end justify-between">
                    <div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      ${{ kpiData.valueProcessed.current.toLocaleString() }}
                    </div>
                    <div class="flex items-center">
                      <ArrowUp v-if="kpiData.valueProcessed.trend > 0" class="h-4 w-4 text-emerald-500 mr-1" />
                      <ArrowDown v-else class="h-4 w-4 text-red-500 mr-1" />
                      <span
                        :class="`text-sm font-medium ${
                          kpiData.valueProcessed.trend > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`"
                      >
                        {{ Math.abs(kpiData.valueProcessed.trend) }}% vs yesterday
                      </span>
                    </div>
                  </div>
                </div>

                <div class="p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/30 transition-colors">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <div class="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                        <Layers class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span class="font-medium text-sm">Volume Processed</span>
                    </div>
                  </div>
                  <div class="flex items-end justify-between">
                    <div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {{ kpiData.volumeProcessed.current }} m³
                    </div>
                    <div class="flex items-center">
                      <ArrowUp v-if="kpiData.volumeProcessed.trend > 0" class="h-4 w-4 text-emerald-500 mr-1" />
                      <ArrowDown v-else class="h-4 w-4 text-red-500 mr-1" />
                      <span
                        :class="`text-sm font-medium ${
                          kpiData.volumeProcessed.trend > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`"
                      >
                        {{ Math.abs(kpiData.volumeProcessed.trend) }}% vs yesterday
                      </span>
                    </div>
                  </div>
                </div>

                <div class="p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/30 transition-colors">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <div class="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                        <MessageSquare class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span class="font-medium text-sm">Feedback Submitted</span>
                    </div>
                  </div>
                  <div class="flex items-end justify-between">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-500">
                      {{ kpiData.feedbackSubmitted.count }}
                    </div>
                    <div class="flex items-center">
                      <ArrowUp v-if="kpiData.feedbackSubmitted.trend > 0" class="h-4 w-4 text-emerald-500 mr-1" />
                      <ArrowDown v-else-if="kpiData.feedbackSubmitted.trend < 0" class="h-4 w-4 text-red-500 mr-1" />
                      <span
                        :class="`text-sm font-medium ${
                          kpiData.feedbackSubmitted.trend > 0
                            ? 'text-emerald-600'
                            : kpiData.feedbackSubmitted.trend < 0
                              ? 'text-red-600'
                              : 'text-slate-500'
                        }`"
                      >
                        {{ Math.abs(kpiData.feedbackSubmitted.trend) }}%
                        {{ kpiData.feedbackSubmitted.trend !== 0
                          ? kpiData.feedbackSubmitted.trend > 0
                            ? ' increase'
                            : ' decrease'
                          : ' no change' }}
                      </span>
                    </div>
                  </div>
                  <div class="text-xs text-muted-foreground mt-1">
                    {{ kpiData.feedbackSubmitted.count }} feedback entries
                  </div>
                </div>
              </div>
            </div>

            <!-- Chart Section -->
            <div class="lg:col-span-8 xl:col-span-9">
              <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-md font-semibold text-slate-800 dark:text-slate-200">
                    Boards Processed per Hour
                  </h3>
                  <div class="flex items-center gap-2">
                    <Button variant="outline" size="sm" class="h-8 text-xs bg-transparent">
                      <Download class="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
                <HourlyBoardChart :data="hourlyBoardStats" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Orders and System Alerts -->
      <div class="grid gap-6 lg:grid-cols-3">
        <Card class="border border-border lg:col-span-2">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
            <div class="space-y-1">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest wood grading operations</CardDescription>
            </div>
            <Button variant="outline" size="sm" @click="$router.push('/batches')">
              View All
              <ChevronRight class="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent class="p-0">
            <RecentOrdersTable :orders="recentOrders" />
          </CardContent>
        </Card>

        <Card class="lg:col-span-1">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
            <div class="space-y-1">
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent notifications and warnings</CardDescription>
            </div>
          </CardHeader>
          <CardContent class="p-3">
            <SystemAlerts :alerts="systemAlerts" />
          </CardContent>
          <CardFooter class="border-t py-3">
            <Button variant="outline" class="w-full bg-transparent" @click="$router.push('/alerts')">
              View All Alerts
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from '../composables/useToast'
import DashboardShell from '../components/DashboardShell.vue'
import Card from '../components/ui/Card.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import CardContent from '../components/ui/CardContent.vue'
import CardTitle from '../components/ui/CardTitle.vue'
import CardDescription from '../components/ui/CardDescription.vue'
import CardFooter from '../components/ui/CardFooter.vue'
import Button from '../components/ui/Button.vue'
import ShiftStatusDisplay from '../components/ShiftStatusDisplay.vue'
import HourlyBoardChart from '../components/HourlyBoardChart.vue'
import RecentOrdersTable from '../components/RecentOrdersTable.vue'
import SystemAlerts from '../components/SystemAlerts.vue'
import {
  PlusCircle,
  DollarSign,
  Layers,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Download,
  ChevronRight
} from 'lucide-vue-next'

const { toast } = useToast()

// Reactive data
const kpiData = ref({
  valueProcessed: {
    current: 24680,
    trend: 8.2
  },
  volumeProcessed: {
    current: 38.4,
    trend: 12.1
  },
  feedbackSubmitted: {
    count: 85,
    trend: 2.3
  }
})

const hourlyBoardStats = ref([])
const recentOrders = ref([])
const systemAlerts = ref([])

// Methods
const handleExtendShift = () => {
  toast({
    title: "Shift Extension Requested",
    description: "Current shift has been notionally extended by 60 minutes. (This is a demo action)",
    duration: 5000,
  })
}

const generateHourlyBoardData = () => {
  const workHours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"]
  const data = []
  const currentHour24 = new Date().getHours()

  workHours.forEach((hourLabel) => {
    const hourInt = parseInt(hourLabel.replace("AM", "").replace("PM", ""))
    const hourIn24Format =
      hourLabel.includes("PM") && hourInt !== 12
        ? hourInt + 12
        : hourLabel.includes("AM") && hourInt === 12
          ? 0
          : hourInt

    if (hourIn24Format > currentHour24 && !(hourLabel === "9AM" && currentHour24 < 9)) {
      data.push({ hour: hourLabel, A: 0, B: 0, C: 0, total: 0 })
      return
    }

    const gradeA = Math.floor(Math.random() * 100) + 20
    const gradeB = Math.floor(Math.random() * 150) + 30
    const gradeC = Math.floor(Math.random() * 80) + 10
    data.push({
      hour: hourLabel,
      A: gradeA,
      B: gradeB,
      C: gradeC,
      total: gradeA + gradeB + gradeC,
    })
  })
  return data
}

const generateRecentOrders = () => {
  return [
    {
      id: 'B-4873',
      date: 'Mar 18, 2025',
      startTime: '09:15 AM',
      endTime: 'In progress',
      status: 'Active',
      volume: '3.8 / 11.2 m³',
      yield: '92.1%'
    },
    {
      id: 'B-4872',
      date: 'Mar 18, 2025',
      startTime: '08:30 AM',
      endTime: '11:45 AM',
      status: 'Completed',
      volume: '12.6 m³',
      yield: '91.8%'
    },
    {
      id: 'B-4871',
      date: 'Mar 18, 2025',
      startTime: '07:15 AM',
      endTime: '10:30 AM',
      status: 'Completed',
      volume: '9.9 m³',
      yield: '92.5%'
    }
  ]
}

const generateSystemAlerts = () => {
  return [
    {
      type: 'warning',
      title: 'Accuracy Drop Detected',
      description: 'Batch #4872 showed 5% lower accuracy than average',
      time: '2 hours ago'
    },
    {
      type: 'info',
      title: 'New Grading Rule Added',
      description: 'Admin user added a new rule for knot detection',
      time: new Date().toLocaleDateString()
    }
  ]
}

const updateData = () => {
  hourlyBoardStats.value = generateHourlyBoardData()
  recentOrders.value = generateRecentOrders()
  systemAlerts.value = generateSystemAlerts()
}

let interval = null

onMounted(() => {
  updateData()
  interval = setInterval(updateData, 30000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>
