<template>
  <DashboardShell>
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold">Claims Management</h1>
          <p class="text-muted-foreground mt-1">Review and process customer claims for lumber batches</p>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" class="flex items-center gap-2">
            <ArrowPathIcon class="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" class="flex items-center gap-2" @click="showShareModal = true">
            <ShareIcon class="h-4 w-4" />
            Share Claim Link
          </Button>
          <Button variant="default" class="flex items-center gap-2" @click="showNewClaimDialog = true">
            <PlusIcon class="h-4 w-4" />
            New Claim
          </Button>
        </div>
      </div>

      <!-- Dashboard Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-lg font-medium">Open Claims</CardTitle>
            <CardDescription>Claims requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-3xl font-bold">{{ newCount + inReviewCount }}</div>
              <div class="flex flex-col items-end">
                <div class="flex items-center gap-1 text-sm">
                  <div class="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>New: {{ newCount }}</span>
                </div>
                <div class="flex items-center gap-1 text-sm">
                  <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span>In Review: {{ inReviewCount }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-lg font-medium">Resolution Rate</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-3xl font-bold">87%</div>
              <div class="flex flex-col items-end">
                <div class="flex items-center gap-1 text-sm">
                  <div class="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Approved: {{ approvedCount }}</span>
                </div>
                <div class="flex items-center gap-1 text-sm">
                  <div class="h-3 w-3 rounded-full bg-red-500"></div>
                  <span>Declined: {{ declinedCount }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-lg font-medium">Average Resolution Time</CardTitle>
            <CardDescription>Time to close claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div class="text-3xl font-bold">3.2 days</div>
              <div class="flex items-center gap-1">
                <ClockIcon class="h-5 w-5 text-muted-foreground" />
                <span class="text-sm text-muted-foreground">{{ closedCount }} closed this month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Search and Filter -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search claims by ID, customer, or batch..."
            class="pl-8"
            v-model="searchQuery"
          />
        </div>
        <Button variant="outline" class="flex items-center gap-2">
          <FunnelIcon class="h-4 w-4" />
          Filters
        </Button>
      </div>

      <!-- Claims Tabs and Table -->
      <div class="space-y-4">
        <div class="border-b">
          <div class="flex space-x-2">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              :class="[
                'px-4 py-2 text-sm font-medium',
                selectedTab === tab.value
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              ]"
              @click="selectedTab = tab.value"
            >
              {{ tab.label }} {{ tab.count ? `(${tab.count})` : '' }}
            </button>
          </div>
        </div>

        <Card>
          <CardContent class="p-0">
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left p-4 font-medium text-muted-foreground">Claim ID</th>
                  <th class="text-left p-4 font-medium text-muted-foreground">Customer</th>
                  <th class="text-left p-4 font-medium text-muted-foreground">Batch ID</th>
                  <th class="text-left p-4 font-medium text-muted-foreground">Date Submitted</th>
                  <th class="text-left p-4 font-medium text-muted-foreground">Issue Type</th>
                  <th class="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th class="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredClaims.length === 0">
                  <td colspan="7" class="text-center py-8 text-muted-foreground">
                    No claims found matching your criteria
                  </td>
                </tr>
                <tr
                  v-for="claim in filteredClaims"
                  :key="claim.id"
                  class="cursor-pointer hover:bg-muted/50 border-t"
                  @click="handleClaimSelect(claim)"
                >
                  <td class="p-4 font-medium">{{ claim.id }}</td>
                  <td class="p-4">{{ claim.customer }}</td>
                  <td class="p-4">{{ claim.batchId }}</td>
                  <td class="p-4">{{ claim.dateSubmitted }}</td>
                  <td class="p-4">{{ claim.issueType }}</td>
                  <td class="p-4">
                    <Badge
                      :variant="getStatusBadgeVariant(claim.status)"
                      :class="getStatusBadgeClass(claim.status)"
                    >
                      {{ claim.status }}
                    </Badge>
                  </td>
                  <td class="p-4 text-right">
                    <div class="relative inline-block">
                      <Button
                        variant="ghost"
                        class="h-8 w-8 p-0"
                        @click.stop="openActionsMenu(claim)"
                      >
                        <EllipsisHorizontalIcon class="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <!-- Claim Detail Dialog -->
      <div v-if="showDetailDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b">
            <h2 class="text-xl font-semibold">Claim Details - {{ selectedClaim?.id }}</h2>
          </div>
          <div class="p-6">
            <div v-if="selectedClaim" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-lg font-medium mb-2">Customer Information</h3>
                  <div class="space-y-2">
                    <div>
                      <span class="text-sm text-muted-foreground">Customer:</span>
                      <p class="font-medium">{{ selectedClaim.customer }}</p>
                    </div>
                    <div>
                      <span class="text-sm text-muted-foreground">Contact Name:</span>
                      <p class="font-medium">{{ selectedClaim.contactName }}</p>
                    </div>
                    <div>
                      <span class="text-sm text-muted-foreground">Contact Email:</span>
                      <p class="font-medium">{{ selectedClaim.contactEmail }}</p>
                    </div>
                    <div>
                      <span class="text-sm text-muted-foreground">Contact Phone:</span>
                      <p class="font-medium">{{ selectedClaim.contactPhone }}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-medium mb-2">Claim Information</h3>
                  <div class="space-y-2">
                    <div>
                      <span class="text-sm text-muted-foreground">Batch ID:</span>
                      <p class="font-medium">{{ selectedClaim.batchId }}</p>
                    </div>
                    <div>
                      <span class="text-sm text-muted-foreground">Date Submitted:</span>
                      <p class="font-medium">{{ selectedClaim.dateSubmitted }}</p>
                    </div>
                    <div>
                      <span class="text-sm text-muted-foreground">Issue Type:</span>
                      <p class="font-medium">{{ selectedClaim.issueType }}</p>
                    </div>
                    <div>
                      <span class="text-sm text-muted-foreground">Status:</span>
                      <div class="mt-1">
                        <Badge
                          :variant="getStatusBadgeVariant(selectedClaim.status)"
                          :class="getStatusBadgeClass(selectedClaim.status)"
                        >
                          {{ selectedClaim.status }}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-medium mb-2">Issue Description</h3>
                <p class="text-sm border rounded-md p-3 bg-muted/30">{{ selectedClaim.description }}</p>
              </div>

              <div>
                <h3 class="text-lg font-medium mb-2">Photos</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    v-for="(photo, index) in selectedClaim.photos"
                    :key="index"
                    class="border rounded-md overflow-hidden"
                  >
                    <img
                      :src="photo || '/placeholder.svg'"
                      :alt="`Claim photo ${index + 1}`"
                      class="w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-medium mb-2">Claim Timeline</h3>
                <div class="border rounded-md divide-y">
                  <div
                    v-for="(event, index) in selectedClaim.timeline"
                    :key="index"
                    class="p-3 flex justify-between items-center"
                  >
                    <div>
                      <p class="font-medium">{{ event.action }}</p>
                      <p class="text-sm text-muted-foreground">By: {{ event.user }}</p>
                    </div>
                    <div class="text-sm text-muted-foreground">{{ event.date }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-6 border-t flex justify-end gap-2">
            <Button
              v-if="selectedClaim?.status === 'New'"
              variant="outline"
              class="flex items-center gap-2"
              @click="updateClaimStatus(selectedClaim.id, 'In Review')"
            >
              <ClockIcon class="h-4 w-4" />
              Mark as In Review
            </Button>
            <Button
              v-if="['New', 'In Review'].includes(selectedClaim?.status || '')"
              variant="outline"
              class="flex items-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
              @click="updateClaimStatus(selectedClaim?.id || '', 'Declined')"
            >
              <XMarkIcon class="h-4 w-4" />
              Decline Claim
            </Button>
            <Button
              v-if="['New', 'In Review'].includes(selectedClaim?.status || '')"
              variant="outline"
              class="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
              @click="updateClaimStatus(selectedClaim?.id || '', 'Approved')"
            >
              <CheckIcon class="h-4 w-4" />
              Approve Claim
            </Button>
            <Button
              v-if="selectedClaim?.status !== 'Closed'"
              variant="default"
              class="flex items-center gap-2"
              @click="updateClaimStatus(selectedClaim?.id || '', 'Closed')"
            >
              <CheckIcon class="h-4 w-4" />
              Close Claim
            </Button>
            <Button variant="outline" @click="showDetailDialog = false">
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <!-- Share Claim Link Modal -->
      <div v-if="showShareModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-background rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6 border-b">
            <h2 class="text-lg font-semibold">Share Claim Submission Link</h2>
            <p class="text-sm text-muted-foreground">Generate a unique link for customers to submit claims</p>
          </div>
          <div class="p-6">
            <div class="flex items-center space-x-2 mt-4">
              <div class="grid flex-1 gap-2">
                <label for="link" class="sr-only">Link</label>
                <Input id="link" value="https://neural-grader.com/claim/CUST-12345-XYZ" readonly />
              </div>
              <Button type="button" size="sm" class="px-3">
                <LinkIcon class="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div class="p-6 border-t flex justify-end gap-2">
            <Button variant="outline" @click="showShareModal = false">
              Cancel
            </Button>
            <Button type="button">Generate New Link</Button>
          </div>
        </div>
      </div>

      <!-- New Claim Dialog -->
      <div v-if="showNewClaimDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-background rounded-lg shadow-xl w-full max-w-lg">
          <div class="p-6 border-b">
            <h2 class="text-lg font-semibold">Create New Claim</h2>
            <p class="text-sm text-muted-foreground">Enter the details for a new customer claim</p>
          </div>
          <div class="p-6">
            <div class="grid gap-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <label for="customer" class="text-right">Customer</label>
                <div class="col-span-3">
                  <select class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="" disabled selected>Select customer</option>
                    <option value="northland">Northland Lumber Co.</option>
                    <option value="pacific">Pacific Coast Timber</option>
                    <option value="eastwood">Eastwood Building Supply</option>
                    <option value="mountain">Mountain Ridge Contractors</option>
                    <option value="riverside">Riverside Lumber Yard</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <label for="batchId" class="text-right">Batch ID</label>
                <Input id="batchId" placeholder="Enter batch ID" class="col-span-3" />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <label for="issueType" class="text-right">Issue Type</label>
                <div class="col-span-3">
                  <select class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="" disabled selected>Select issue type</option>
                    <option value="grade">Grade Dispute</option>
                    <option value="damage">Delivery Damage</option>
                    <option value="quantity">Quantity Discrepancy</option>
                    <option value="quality">Quality Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-4 items-start gap-4">
                <label for="description" class="text-right pt-2">Description</label>
                <textarea
                  id="description"
                  placeholder="Describe the issue in detail"
                  class="col-span-3 h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="p-6 border-t flex justify-end gap-2">
            <Button variant="outline" @click="showNewClaimDialog = false">
              Cancel
            </Button>
            <Button type="button">Create Claim</Button>
          </div>
        </div>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DashboardShell from '@/components/DashboardShell.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Input from '@/components/ui/Input.vue'
import {
  PlusIcon,
  ArrowPathIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  LinkIcon
} from '@heroicons/vue/24/outline'

// Sample data for claims
interface ClaimTimelineEvent {
  date: string
  action: string
  user: string
}

interface Claim {
  id: string
  customer: string
  batchId: string
  dateSubmitted: string
  issueType: string
  status: string
  description: string
  contactName: string
  contactEmail: string
  contactPhone: string
  photos: string[]
  timeline: ClaimTimelineEvent[]
}

const claimsData = ref<Claim[]>([
  {
    id: "CLM-2023-001",
    customer: "Northland Lumber Co.",
    batchId: "BATCH-4872",
    dateSubmitted: "2023-11-15",
    issueType: "Grade Dispute",
    status: "New",
    description:
      "Customer received batch with 15% of boards graded lower than expected. Requesting review of grading process.",
    contactName: "John Peterson",
    contactEmail: "jpeterson@northlandlumber.com",
    contactPhone: "555-123-4567",
    photos: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    timeline: [
      { date: "2023-11-15", action: "Claim submitted", user: "John Peterson" },
      { date: "2023-11-15", action: "Claim received", user: "System" },
    ],
  },
  {
    id: "CLM-2023-002",
    customer: "Pacific Coast Timber",
    batchId: "BATCH-4865",
    dateSubmitted: "2023-11-12",
    issueType: "Delivery Damage",
    status: "In Review",
    description: "Significant water damage to approximately 20% of the order. Boards warped and stained.",
    contactName: "Sarah Williams",
    contactEmail: "swilliams@pctimber.com",
    contactPhone: "555-987-6543",
    photos: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    timeline: [
      { date: "2023-11-12", action: "Claim submitted", user: "Sarah Williams" },
      { date: "2023-11-12", action: "Claim received", user: "System" },
      { date: "2023-11-13", action: "Assigned to Mike Johnson", user: "Admin" },
      { date: "2023-11-14", action: "Photos reviewed", user: "Mike Johnson" },
    ],
  },
  {
    id: "CLM-2023-003",
    customer: "Eastwood Building Supply",
    batchId: "BATCH-4810",
    dateSubmitted: "2023-11-08",
    issueType: "Quantity Discrepancy",
    status: "Approved",
    description: "Order received was short by approximately 200 board feet compared to invoice.",
    contactName: "Robert Chen",
    contactEmail: "rchen@eastwoodsupply.com",
    contactPhone: "555-456-7890",
    photos: ["/placeholder.svg?height=300&width=400"],
    timeline: [
      { date: "2023-11-08", action: "Claim submitted", user: "Robert Chen" },
      { date: "2023-11-08", action: "Claim received", user: "System" },
      { date: "2023-11-09", action: "Assigned to Lisa Parker", user: "Admin" },
      { date: "2023-11-10", action: "Inventory checked", user: "Lisa Parker" },
      { date: "2023-11-14", action: "Claim approved", user: "Lisa Parker" },
    ],
  },
  {
    id: "CLM-2023-004",
    customer: "Mountain Ridge Contractors",
    batchId: "BATCH-4795",
    dateSubmitted: "2023-11-05",
    issueType: "Grade Dispute",
    status: "Declined",
    description: "Customer claims 30% of boards were below specified grade. Requesting partial refund.",
    contactName: "David Martinez",
    contactEmail: "dmartinez@mountainridge.com",
    contactPhone: "555-789-0123",
    photos: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
    timeline: [
      { date: "2023-11-05", action: "Claim submitted", user: "David Martinez" },
      { date: "2023-11-05", action: "Claim received", user: "System" },
      { date: "2023-11-06", action: "Assigned to James Wilson", user: "Admin" },
      { date: "2023-11-08", action: "Sample boards re-graded", user: "James Wilson" },
      { date: "2023-11-10", action: "Grading verified as accurate", user: "Quality Control" },
      { date: "2023-11-12", action: "Claim declined", user: "James Wilson" },
    ],
  },
  {
    id: "CLM-2023-005",
    customer: "Riverside Lumber Yard",
    batchId: "BATCH-4782",
    dateSubmitted: "2023-11-01",
    issueType: "Delivery Damage",
    status: "Closed",
    description: "Edge damage to approximately 50 boards during shipping. Requesting replacement or credit.",
    contactName: "Jennifer Lopez",
    contactEmail: "jlopez@riversidelumber.com",
    contactPhone: "555-234-5678",
    photos: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    timeline: [
      { date: "2023-11-01", action: "Claim submitted", user: "Jennifer Lopez" },
      { date: "2023-11-01", action: "Claim received", user: "System" },
      { date: "2023-11-02", action: "Assigned to Thomas Brown", user: "Admin" },
      { date: "2023-11-03", action: "Photos reviewed", user: "Thomas Brown" },
      { date: "2023-11-05", action: "Shipping company contacted", user: "Thomas Brown" },
      { date: "2023-11-08", action: "Partial credit approved", user: "Thomas Brown" },
      { date: "2023-11-10", action: "Credit issued", user: "Accounting" },
      { date: "2023-11-10", action: "Claim closed", user: "Thomas Brown" },
    ],
  },
])

// State
const searchQuery = ref('')
const selectedTab = ref('all')
const selectedClaim = ref<Claim | null>(null)
const showDetailDialog = ref(false)
const showShareModal = ref(false)
const showNewClaimDialog = ref(false)

// Tabs
const tabs = computed(() => [
  { value: 'all', label: 'All Claims', count: claimsData.value.length },
  { value: 'new', label: 'New', count: newCount.value },
  { value: 'in-review', label: 'In Review', count: inReviewCount.value },
  { value: 'approved', label: 'Approved', count: approvedCount.value },
  { value: 'declined', label: 'Declined', count: declinedCount.value },
  { value: 'closed', label: 'Closed', count: closedCount.value }
])

// Computed properties
const newCount = computed(() => claimsData.value.filter(claim => claim.status === 'New').length)
const inReviewCount = computed(() => claimsData.value.filter(claim => claim.status === 'In Review').length)
const approvedCount = computed(() => claimsData.value.filter(claim => claim.status === 'Approved').length)
const declinedCount = computed(() => claimsData.value.filter(claim => claim.status === 'Declined').length)
const closedCount = computed(() => claimsData.value.filter(claim => claim.status === 'Closed').length)

const filteredClaims = computed(() => {
  return claimsData.value.filter(claim => {
    const matchesSearch =
      searchQuery.value === '' ||
      claim.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      claim.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      claim.batchId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      claim.issueType.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      selectedTab.value === 'all' ||
      (selectedTab.value === 'new' && claim.status === 'New') ||
      (selectedTab.value === 'in-review' && claim.status === 'In Review') ||
      (selectedTab.value === 'approved' && claim.status === 'Approved') ||
      (selectedTab.value === 'declined' && claim.status === 'Declined') ||
      (selectedTab.value === 'closed' && claim.status === 'Closed')

    return matchesSearch && matchesStatus
  })
})

// Methods
const handleClaimSelect = (claim: Claim) => {
  selectedClaim.value = claim
  showDetailDialog.value = true
}

const openActionsMenu = (claim: Claim) => {
  // In a real app, this would open a dropdown menu
  handleClaimSelect(claim)
}

const updateClaimStatus = (claimId: string, newStatus: string) => {
  const claimIndex = claimsData.value.findIndex(c => c.id === claimId)
  if (claimIndex !== -1) {
    // Update the claim status
    claimsData.value[claimIndex].status = newStatus
    
    // Add a timeline event
    claimsData.value[claimIndex].timeline.push({
      date: new Date().toISOString().split('T')[0],
      action: `Status changed to ${newStatus}`,
      user: 'Admin'
    })
    
    // Close the dialog
    showDetailDialog.value = false
  }
}

const getStatusBadgeVariant = (status: string): string => {
  switch (status) {
    case 'New':
    case 'In Review':
    case 'Approved':
    case 'Declined':
    case 'Closed':
      return 'outline'
    default:
      return 'outline'
  }
}

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'New':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'In Review':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'Approved':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'Declined':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'Closed':
      return 'bg-gray-50 text-gray-700 border-gray-200'
    default:
      return ''
  }
}
</script>