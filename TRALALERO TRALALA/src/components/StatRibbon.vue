<template>
  <div>
    <div class="bg-base-100 p-7">
      <h2 class="text-xl font-semibold mb-4 pb-2">Value Information:</h2>
      <p class="text-lg">Portfolio Value (including PP): ${{ totalValue }}</p>
      <p class="text-lg mb-1">Purchasing Power: ${{ Math.floor(balance * 100) / 100 }}</p>
    </div>
    <div class="bg-base-100 p-7">
      <OwnedStocks :ownedStocks="stocks" />
    </div>
    <div class="bg-base-100 p-7">
      <PurchaseHistory :stocks="stocks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import OwnedStocks from '@/components/OwnedStocks.vue'
import type { Stock } from '@/types/types'
import PurchaseHistory from './PurchaseHistory.vue'

defineProps<{
  balance: number
  stocks: Stock[]
  totalValue: number
}>()
</script>
