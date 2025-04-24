<template>
  <div v-if="auth.isLoggedIn"><LineChart :data="data" :options="options"/></div>
  <div v-else><h2>YOU ARENT LOGGED IN</h2></div>
</template>

<script setup lang="ts">
import LineChart from '@/components/LineChart.vue';
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()


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
