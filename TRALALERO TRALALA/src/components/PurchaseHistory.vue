<template>
  <div>
    <h2 class="text-xl font-semibold pb-2">Purchase History:</h2>
    <template v-if="sortedStocks.length > 0">
      <PurchaseCard v-for="stock in sortedStocks" :key="stock.id" :stock="stock" />
    </template>
    <p v-else>&emsp;No stocks purchased</p>
  </div>
</template>

<script setup lang="ts">
import type { Stock, StocksData } from '@/types/types'
import PurchaseCard from '@/components/PurchaseCard.vue'
import { computed } from 'vue'

const props = defineProps<{
  stocks: Stock[] | null
}>()

const sortedStocks = computed(() => {
  if (!props.stocks) return []

  return [...props.stocks].sort((a, b) => {
    return b.time_id - a.time_id
  })
})

console.log(props.stocks)
</script>
