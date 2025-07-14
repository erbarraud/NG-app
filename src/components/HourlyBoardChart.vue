<template>
  <Card>
    <CardHeader>
      <CardTitle>Hourly Production</CardTitle>
      <CardDescription>Boards graded per hour</CardDescription>
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
  data: [2300, 2100, 2500, 2800, 2600, 2400, 2200, 2900]
}])

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm'],
  },
  yaxis: {
    title: {
      text: 'Boards'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " boards"
      }
    }
  }
})
</script>
