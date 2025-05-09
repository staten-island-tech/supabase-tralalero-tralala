<template>
  <div><ProfileRibbon /><StatRibbon /><D3Test/></div>
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

import D3Test from '@/components/D3Test.vue'

const options = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>
