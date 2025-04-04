<template>
  <div>
    <Line :data="props.data" :options="props.options" />
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  RadialLinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, RadialLinearScale)

const props = defineProps({
  data: Object,
  options: Object,
})
</script>

<style scoped></style>
