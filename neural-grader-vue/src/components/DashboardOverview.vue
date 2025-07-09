<template>
  <div class="flex flex-col gap-6 w-full">
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
            <div class="relative">
              <Button variant="outline" size="sm" class="h-8 px-2.5 bg-transparent">
                <PlusCircleIcon class="h-3.5 w-3.5 mr-1.5" />
                Extend (+1h)
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="grid lg:grid-cols-12 gap-0">
          <div class="lg:col-span-4 xl:col-span-3 border-r border-border bg-slate-50/50 dark:bg-slate-900/20">
            <div class="grid grid-cols-1 divide-y">
              <div class="p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/30 transition-colors">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-md">
                      <CurrencyDollarIcon class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span class="font-medium text-sm">Value Processed</span>
                  </div>
                  <div class="h-8 w-16">
                    <!-- Placeholder for sparkline chart -->
                    <div class="h-full w-full bg-emerald-100/50 rounded"></div>
                  </div>
                </div>
                <div class="flex items-end justify-between">
                  <div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    $24,680
                  </div>
                  <div class="flex items-center">
                    <ArrowUpIcon class="h-4 w-4 text-emerald-500 mr-1" />
                    <span class="text-sm font-medium text-emerald-600">
                      8.2% vs yesterday
                    </span>
                  </div>
                </div>
              </div>

              <div class="p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/30 transition-colors">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                      <SquareStackIcon class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span class="font-medium text-sm">Volume Processed</span>
                  </div>
                  <div class="h-8 w-16">
                    <!-- Placeholder for sparkline chart -->
                    <div class="h-full w-full bg-blue-100/50 rounded"></div>
                  </div>
                </div>
                <div class="flex items-end justify-between">
                  <div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    38.4 m³
                  </div>
                  <div class="flex items-center">
                    <ArrowUpIcon class="h-4 w-4 text-emerald-500 mr-1" />
                    <span class="text-sm font-medium text-emerald-600">
                      12.1% vs yesterday
                    </span>
                  </div>
                </div>
              </div>

              <div class="p-4 hover:bg-slate-100/80 dark:hover:bg-slate-800/30 transition-colors">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                      <ChatBubbleLeftRightIcon class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span class="font-medium text-sm">Feedback Submitted</span>
                  </div>
                  <div class="relative">
                    <button class="h-8 w-8 flex items-center justify-center">
                      <EllipsisHorizontalIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div class="flex items-end justify-between">
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-500">
                    {{ feedbackCount }}
                  </div>
                  <div class="flex items-center">
                    <ArrowUpIcon v-if="feedbackTrend > 0" class="h-4 w-4 text-emerald-500 mr-1" />
                    <ArrowDownIcon v-else-if="feedbackTrend < 0" class="h-4 w-4 text-red-500 mr-1" />
                    <span
                      :class="`text-sm font-medium ${
                        feedbackTrend > 0
                          ? 'text-emerald-600'
                          : feedbackTrend < 0
                          ? 'text-red-600'
                          : 'text-slate-500'
                      }`"
                    >
                      {{ Math.abs(feedbackTrend) }}%
                      {{ feedbackTrend !== 0
                        ? feedbackTrend > 0
                          ? " increase"
                          : " decrease"
                        : " no change" }}
                    </span>
                  </div>
                </div>
                <div class="text-xs text-muted-foreground mt-1">
                  {{ feedbackCount }} feedback entries
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-8 xl:col-span-9">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-md font-semibold text-slate-800 dark:text-slate-200">
                  Boards Processed per Hour
                </h3>
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm" class="h-8 text-xs bg-transparent">
                    <ArrowDownTrayIcon class="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              <div class="h-[300px] w-full">
                <BarChart :chart-data="chartData" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="grid gap-6 lg:grid-cols-3">
      <Card class="border border-border lg:col-span-2">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <div class="space-y-1">
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest wood grading operations</CardDescription>
          </div>
          <Button variant="outline" size="sm" @click="$router.push('/batches')">
            View All
            <ChevronRightIcon class="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent class="p-0">
          <!-- Mock data for recent orders table. In a real app, this would be dynamic. -->
          <table class="w-full">
            <thead>
              <tr class="border-b transition-colors hover:bg-muted/50">
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Start Time</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">End Time</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Volume</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Yield</th>
                <th class="h-10 px-2 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id" class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">{{ order.id }}</td>
                <td class="p-2 align-middle">{{ order.date }}</td>
                <td class="p-2 align-middle">{{ order.startTime }}</td>
                <td class="p-2 align-middle">
                  <span v-if="order.endTime" class="text-sm text-muted-foreground">{{ order.endTime }}</span>
                  <span v-else class="text-sm text-muted-foreground">In progress</span>
                </td>
                <td class="p-2 align-middle">
                  <div class="flex items-center gap-1.5">
                    <div :class="`h-2 w-2 rounded-full ${order.statusColor}`"></div>
                    <span class="text-sm font-medium">{{ order.status }}</span>
                  </div>
                </td>
                <td class="p-2 align-middle">{{ order.volume }}</td>
                <td class="p-2 align-middle">{{ order.yield }}</td>
                <td class="p-2 align-middle text-right">
                  <div class="relative">
                    <button class="p-1 rounded-md hover:bg-muted">
                      <EllipsisHorizontalIcon class="h-4 w-4" />
                      <span class="sr-only">Actions</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
          <div class="space-y-3">
            <!-- Mock system alerts -->
            <div class="flex items-start gap-4 rounded-lg border-l-4 border-l-amber-500 border p-3 hover:bg-muted/50">
              <div class="text-amber-500">
                <ExclamationTriangleIcon class="h-5 w-5" />
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium">Accuracy Drop Detected</p>
                <p class="text-sm text-muted-foreground">Batch #4872 showed 5% lower accuracy than average</p>
                <div class="flex items-center pt-1">
                  <ClockIcon class="mr-1 h-3 w-3 text-muted-foreground" />
                  <span class="text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </div>
            <div class="flex items-start gap-4 rounded-lg border-l-4 border-l-blue-500 border p-3 hover:bg-muted/50">
              <div class="text-blue-500">
                <DocumentTextIcon class="h-5 w-5" />
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium">New Grading Rule Added</p>
                <p class="text-sm text-muted-foreground">Admin user added a new rule for knot detection</p>
                <div class="flex items-center pt-1">
                  <ClockIcon class="mr-1 h-3 w-3 text-muted-foreground" />
                  <span class="text-xs text-muted-foreground">{{ formatDate(new Date()) }}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter class="border-t py-3">
          <Button variant="outline" class="w-full bg-transparent" @click="$router.push('/alerts')">
            View All Alerts
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  SquareStackIcon
} from '@heroicons/vue/24/outline'
import Card from './ui/Card.vue'
import CardHeader from './ui/CardHeader.vue'
import CardTitle from './ui/CardTitle.vue'
import CardDescription from './ui/CardDescription.vue'
import CardContent from './ui/CardContent.vue'
import CardFooter from './ui/CardFooter.vue'
import Button from './ui/Button.vue'
import BarChart from './charts/BarChart.vue'
import ShiftStatusDisplay from './ShiftStatusDisplay.vue'

const router = useRouter()

// Sample data for the chart
const chartData = {
  labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
  datasets: [
    {
      label: 'Grade A',
      backgroundColor: '#22c55e',
      data: [100, 120, 90, 130, 110, 120, 150, 100]
    },
    {
      label: 'Grade B',
      backgroundColor: '#3b82f6',
      data: [150, 160, 140, 170, 150, 160, 180, 150]
    },
    {
      label: 'Grade C',
      backgroundColor: '#eab308',
      data: [50, 40, 50, 60, 50, 50, 40, 50]
    }
  ]
}

// Sample data for recent orders
const recentOrders = reactive([
  {
    id: 'B-4873',
    date: 'Mar 18, 2025',
    startTime: '09:15 AM',
    endTime: null,
    status: 'Active',
    statusColor: 'bg-emerald-500',
    volume: '3.8 / 11.2 m³',
    yield: '92.1%'
  },
  {
    id: 'B-4872',
    date: 'Mar 18, 2025',
    startTime: '08:30 AM',
    endTime: '11:45 AM',
    status: 'Completed',
    statusColor: 'bg-gray-500',
    volume: '12.6 m³',
    yield: '91.8%'
  },
  {
    id: 'B-4871',
    date: 'Mar 18, 2025',
    startTime: '07:15 AM',
    endTime: '10:30 AM',
    status: 'Completed',
    statusColor: 'bg-gray-500',
    volume: '9.9 m³',
    yield: '92.5%'
  }
])

// Feedback data
const feedbackCount = ref(Math.floor(Math.random() * 120) + 30) // e.g., 30-150 feedbacks
const feedbackTrend = ref(Number.parseFloat((Math.random() * 10 - 5).toFixed(1))) // e.g., -5.0% to +5.0%

// Format date helper function
const formatDate = (date: Date) => {
  return format(date, 'MMM d, yyyy')
}

onMounted(() => {
  // Simulate data refresh
  const refreshInterval = setInterval(() => {
    feedbackCount.value = Math.floor(Math.random() * 120) + 30
    feedbackTrend.value = Number.parseFloat((Math.random() * 10 - 5).toFixed(1))
  }, 30000)

  // Clean up on component unmount
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
})
</script>