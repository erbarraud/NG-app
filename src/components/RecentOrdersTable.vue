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
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="order in orders" :key="order.id">
            <TableCell class="font-medium">{{ order.id }}</TableCell>
            <TableCell>{{ order.customer }}</TableCell>
            <TableCell>
              <Badge :variant="order.status === 'Completed' ? 'default' : (order.status === 'In Progress' ? 'secondary' : 'destructive')">
                {{ order.status }}
              </Badge>
            </TableCell>
            <TableCell class="text-right">{{ order.quantity }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import Badge from '@/components/ui/Badge.vue'

const orders = ref([
  { id: '#ORD-2024-0012', customer: 'Lumber Co.', status: 'In Progress', quantity: 12000 },
  { id: '#ORD-2024-0011', customer: 'BuildMart', status: 'Completed', quantity: 8500 },
  { id: '#ORD-2024-0010', customer: 'Fine Woods Inc.', status: 'Completed', quantity: 25000 },
  { id: '#ORD-2024-0009', customer: 'Lumber Co.', status: 'Completed', quantity: 15000 },
]);
</script>
