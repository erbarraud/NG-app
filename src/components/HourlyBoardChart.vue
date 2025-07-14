<template>
  <Card>
    <CardHeader>
      <CardTitle>Hourly Production</CardTitle>
      <CardDescription>Boards graded per hour over the last 12 hours.</CardDescription>
    </CardHeader>
    <CardContent>
      <apexchart type="area" height="180" :options="chartOptions" :series="series"></apexchart>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

const series = ref([{
  name: 'Boards Graded',
  data: [1200, 1250, 1100, 1380, 1500, 1420, 1600, 1550, 1480, 1620, 1700, 1850]
}]);

const chartOptions = ref({
  chart: {
    type: 'area',
    height: 180,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    categories: ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'],
    labels: {
      style: {
        colors: '#888',
        fontSize: '12px'
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#888',
        fontSize: '12px'
      },
      formatter: (val) => { return val.toFixed(0) }
    }
  },
  grid: {
    borderColor: 'hsl(var(--border))',
    strokeDashArray: 3,
  },
  tooltip: {
    theme: 'dark'
  },
  colors: ["#fff"],
});
</script>
