<template>
  <div><LineChart :data="chartData" :options="chartOptions" /></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LineChart from '../components/LineChart.vue'

const chartData = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: ['red', 'blue', 'yellow'],
      data: [],
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Races of Perpetrators',
      font: {
        size: 20,
      },
      color: '#FFFFF0',
    },
    legend: {
      position: 'top',
      labels: {
        color: '#FFFFF0',
      },
    },
    tooltip: {
      titleColor: '#FFFFF0',
      bodyColor: '#FFFFF0',
    },
  },
  aspectRatio: 1,

  legend: {
    position: 'top',
    labels: {
      font: {
        size: 14,
      },
    },
  },
})

async function fetchData() {
  try {
    const response = await fetch('')
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
