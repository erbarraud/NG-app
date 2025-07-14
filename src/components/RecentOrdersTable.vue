<template>
  <Card>
    <CardHeader>
      <CardTitle>Recent Orders</CardTitle>
      <CardDescription>A list of the most recent production orders.</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="order in orders" :key="order.id">
            <TableCell class="font-medium">{{ order.id }}</TableCell>
            <TableCell>
              <Badge :variant="order.status === 'Completed' ? 'default' : 'secondary'">{{ order.status }}</Badge>
            </TableCell>
            <TableCell>{{ order.quantity }}</TableCell>
            <TableCell>{{ order.dueDate }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Table from '@/components/ui/Table.vue'
import TableHeader from '@/components/ui/TableHeader.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableRow from '@/components/ui/TableRow.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableCell from '@/components/ui/TableCell.vue'
import Badge from '@/components/ui/Badge.vue'

const orders = ref([
  { id: '#ORD-2024-0012', status: 'Running', quantity: 5000, dueDate: '2024-07-15' },
  { id: '#ORD-2024-0011', status: 'Completed', quantity: 2500, dueDate: '2024-07-14' },
  { id: '#ORD-2024-0010', status: 'Completed', quantity: 7000, dueDate: '2024-07-13' },
  { id: '#ORD-2024-0009', status: 'Completed', quantity: 3200, dueDate: '2024-07-12' },
])
</script>
