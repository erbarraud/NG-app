<script setup>
import { cn } from '@/lib/utils'

const card = 'div'
const cardHeader = 'div'
const cardTitle = 'h3'
const cardDescription = 'p'
const cardContent = 'div'
const cardFooter = 'div'
</script>

<script>
export const Card = 'div'
export const CardHeader = 'div'
export const CardTitle = 'h3'
export const CardDescription = 'p'
export const CardContent = 'div'
export const CardFooter = 'div'
</script>

<template>
  <component :is="Card" :class="cn('rounded-lg border bg-card text-card-foreground shadow-sm', $attrs.class)">
    <slot />
  </component>
</template>
