<template>
  <Card>
    <CardHeader>
      <CardTitle>Hourly Board Count</CardTitle>
      <CardDescription>Boards processed per hour over the last 12 hours.</CardDescription>
    </CardHeader>
    <CardContent>
      <apexchart type="bar" height="300" :options="chartOptions" :series="series"></apexchart>
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

const series = ref([{
  name: 'Boards',
  data: [1200, 1250, 1100, 1300, 900, 1150, 1220, 1350, 1280, 1400, 1320, 1280]
}])

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  dataLabels: { enabled: false },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'],
    labels: {
      style: {
        colors: '#888',
      }
    }
  },
  yaxis: {
    title: { text: 'Boards Processed' },
    labels: {
      style: {
        colors: '#888',
      }
    }
  },
  fill: { opacity: 1 },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " boards"
      }
    }
  },
  grid: {
    borderColor: '#444',
    strokeDashArray: 4,
  },
  theme: {
    mode: 'dark'
  }
})
</script>
