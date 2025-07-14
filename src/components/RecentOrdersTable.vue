<template>
 <Card class="lg:col-span-2">
   <CardHeader>
     <CardTitle>Recent Orders</CardTitle>
     <CardDescription>A summary of the most recent production orders.</CardDescription>
   </CardHeader>
   <CardContent>
     <Table>
       <TableHeader>
         <TableRow>
           <TableHead>Order ID</TableHead>
           <TableHead>Customer</TableHead>
           <TableHead>Status</TableHead>
           <TableHead>Quantity</TableHead>
         </TableRow>
       </TableHeader>
       <TableBody>
         <TableRow v-for="order in orders" :key="order.id">
           <TableCell class="font-medium">{{ order.id }}</TableCell>
           <TableCell>{{ order.customer }}</TableCell>
           <TableCell>
             <Badge :variant="getStatusVariant(order.status)">{{ order.status }}</Badge>
           </TableCell>
           <TableCell>{{ order.quantity }}</TableCell>
         </TableRow>
       </TableBody>
     </Table>
   </CardContent>
 </Card>
</template>

<script setup>
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card.vue'
import Table from '@/components/ui/Table.vue'
import TableHeader from '@/components/ui/TableHeader.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableRow from '@/components/ui/TableRow.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableCell from '@/components/ui/TableCell.vue'
import Badge from '@/components/ui/Badge.vue'

const orders = ref([
 { id: 'ORD-001', customer: 'Lumber Co.', status: 'Completed', quantity: 1200 },
 { id: 'ORD-002', customer: 'Builders Inc.', status: 'In Progress', quantity: 800 },
 { id: 'ORD-003', customer: 'Fine Woods', status: 'Pending', quantity: 2500 },
 { id: 'ORD-004', customer: 'Lumber Co.', status: 'Completed', quantity: 1500 },
])

const getStatusVariant = (status) => {
 if (status === 'Completed') return 'success'
 if (status === 'In Progress') return 'warning'
 return 'default'
}
</script>
