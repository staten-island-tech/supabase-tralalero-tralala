<template>
  <div><LineChart :data="data" :options="options"/></div>
</template>

<script setup lang="ts">
import LineChart from '@/components/LineChart.vue';

const data = {  
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: [40, 39, 10, 40, 39, 80, 40]
    }
  ]
}

const options = {  
  responsive: true,
  maintainAspectRatio: false}
</script>

<style scoped></style>
