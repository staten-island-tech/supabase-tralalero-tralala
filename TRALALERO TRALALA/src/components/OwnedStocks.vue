<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-800 pb-2 border-gray-200">Owned Stocks:</h2>
    <input
      class="m-2 accent-black transform scale-110"
      type="checkbox"
      id="showSold"
      v-model="showSold"
    />
    <label for="showSold">Show sold stocks</label>
    <PurchaseCard
      v-if="(ownedStocks || []).length > 0"
      v-for="stock in ownedStocks || []"
      :key="stock.id"
      :stock="stock"
      :sold="stock.date_sold"
      :show="showSold"
    />
    <p v-else>&emsp;No stocks owned</p>
  </div>
</template>

<script setup lang="ts">
import type { Stock } from '@/types/types'
import PurchaseCard from '@/components/PurchaseCard.vue'
import { ref } from 'vue'

const showSold = ref(false)

defineProps<{
  ownedStocks: Stock[] | null
}>()
</script>
