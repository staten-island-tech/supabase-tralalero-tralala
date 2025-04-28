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
  <div><ProfileRibbon /><StatRibbon /><LineChart :data="data" :options="options" /></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import ProfileRibbon from '@/components/ProfileRibbon.vue'
import StatRibbon from '@/components/StatRibbon.vue'
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (route.params.id == '') {
    console.log(auth.id)
    router.push({ path: `/profile/${auth.id}`, replace: true })
  }
})

import LineChart from '@/components/LineChart.vue'
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: [40, 39, 10, 40, 39, 80, 40],
    },
  ],
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>
