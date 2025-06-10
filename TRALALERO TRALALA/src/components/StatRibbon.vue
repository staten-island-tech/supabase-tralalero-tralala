<template>
  <div>
    <div class="bg-white border-b border-gray-200 p-7">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-gray-200">
        Value Information:
      </h2>
      <p class="text-lg">Portfolio Value (including PP): ${{ totalValue }}</p>
      <p class="text-lg mb-1">Purchasing Power: ${{ Math.floor(balance * 100) / 100 }}</p>
    </div>
    <div class="bg-white border-b border-gray-200 p-7">
      <OwnedStocks :ownedStocks="stocks || []" />
    </div>
  </div>
</template>

<script setup lang="ts">
import OwnedStocks from '@/components/OwnedStocks.vue'
import type { Stock } from '@/types/types'

defineProps<{
  balance: number
  stocks: Stock[] | null
  unsoldStocks: Stock[] | null
  totalValue: string
}>()
</script>
