<template>
  <div class="h-[300px] w-full">
    <canvas ref="chartCanvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartCanvas = ref(null)
let chart = null

const createChart = () => {
  if (!chartCanvas.value || !props.data.length) return
  
  const ctx = chartCanvas.value.getContext('2d')
  const canvas = chartCanvas.value
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Set canvas size
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  
  // Chart dimensions
  const padding = 60
  const chartWidth = canvas.width - padding * 2
  const chartHeight = canvas.height - padding * 2
  
  // Find max value for scaling
  const maxValue = Math.max(...props.data.map(d => d.total))
  
  // Draw bars
  const barWidth = chartWidth / props.data.length * 0.8
  const barSpacing = chartWidth / props.data.length * 0.2
  
  props.data.forEach((item, index) => {
    const x = padding + index * (barWidth + barSpacing)
    
    // Draw Grade A (bottom)
    const aHeight = (item.A / maxValue) * chartHeight
    ctx.fillStyle = 'hsl(var(--primary))'
    ctx.fillRect(x, padding + chartHeight - aHeight, barWidth, aHeight)
    
    // Draw Grade B (middle)
    const bHeight = (item.B / maxValue) * chartHeight
    ctx.fillStyle = 'hsl(var(--chart-2))'
    ctx.fillRect(x, padding + chartHeight - aHeight - bHeight, barWidth, bHeight)
    
    // Draw Grade C (top)
    const cHeight = (item.C / maxValue) * chartHeight
    ctx.fillStyle = 'hsl(var(--chart-3))'
    ctx.fillRect(x, padding + chartHeight - aHeight - bHeight - cHeight, barWidth, cHeight)
    
    // Draw hour label
    ctx.fillStyle = '#64748b'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(item.hour, x + barWidth / 2, canvas.height - 20)
  })
  
  // Draw Y-axis labels
  ctx.fillStyle = '#64748b'
  ctx.font = '10px sans-serif'
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const value = (maxValue / 5) * i
    const y = padding + chartHeight - (i / 5) * chartHeight
    ctx.fillText(Math.round(value).toString(), padding - 10, y + 3)
  }
  
  // Draw grid lines
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = padding + chartHeight - (i / 5) * chartHeight
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(padding + chartWidth, y)
    ctx.stroke()
  }
}

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  createChart()
}, { deep: true })
</script>
