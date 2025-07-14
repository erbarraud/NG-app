<script>
import { h } from 'vue'
import { cn } from '@/lib/utils'

const Card = (props, { slots, attrs }) => {
  return h('div', { class: cn('rounded-lg border bg-card text-card-foreground shadow-sm', attrs.class) }, slots.default ? slots.default() : [])
}

const CardHeader = (props, { slots, attrs }) => {
  return h('div', { class: cn('flex flex-col space-y-1.5 p-6', attrs.class) }, slots.default ? slots.default() : [])
}

const CardTitle = (props, { slots, attrs }) => {
  return h('h3', { class: cn('text-2xl font-semibold leading-none tracking-tight', attrs.class) }, slots.default ? slots.default() : [])
}

const CardDescription = (props, { slots, attrs }) => {
  return h('p', { class: cn('text-sm text-muted-foreground', attrs.class) }, slots.default ? slots.default() : [])
}

const CardContent = (props, { slots, attrs }) => {
  return h('div', { class: cn('p-6 pt-0', attrs.class) }, slots.default ? slots.default() : [])
}

const CardFooter = (props, { slots, attrs }) => {
  return h('div', { class: cn('flex items-center p-6 pt-0', attrs.class) }, slots.default ? slots.default() : [])
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
</script>
