<template>
  <div v-if="stock.amount > 0" class="bg-gray-800 rounded-lg shadow p-4 border border-gray-200 m-4">
    <div class="flex items-center justify-between">
      <span
        @click="router.push({ path: `/stock/${stock.ticker}`, replace: true })"
        class="font-bold text-lg cursor-pointer hover:text-blue-600"
      >
        {{ stock.ticker }}
      </span>
      <span class="text-gray-300 text-sm">Bought at ${{ stock.totalPurchasePrice }}</span>
    </div>
    <div class="mt-2 flex justify-between items-center">
      <span class="text-gray-300">
        {{ stock.amount }} share{{ stock.amount !== 1 ? 's' : '' }} - Worth ${{
          (stock.amount * getLatestPrice(stock.ticker)).toFixed(2)
        }}
      </span>
      <span
        :class="{
          'text-green-500': calculateProfit(stock) >= 0,
          'text-red-500': calculateProfit(stock) < 0,
          'text-sm': true,
        }"
      >
        {{ calculateProfit(stock) >= 0 ? '+' : '' }}{{ calculateProfit(stock).toFixed(2) }} ({{
          calculateProfitPercentage(stock).toFixed(2)
        }}%)
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stock, StocksData } from '@/types/types'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()

import { stocksData as rawStocksData } from '@/stockArrays'

const today = new Date()
const formattedDate = ref(today.toISOString().split('T')[0])

const stocksData = rawStocksData as StocksData

const getLatestPrice = (ticker: string): number => {
  const dailyData = stocksData[ticker]?.['Time Series (Daily)']
  if (!dailyData) return 0

  if (dailyData[formattedDate.value]) {
    return Number(dailyData[formattedDate.value]['4. close'])
  }

  const dates = Object.keys(dailyData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  for (const date of dates) {
    if (new Date(date) <= today) {
      return Number(dailyData[date]['4. close'])
    }
  }

  return 0
}

const calculateProfit = (
  stock: Stock & { ticker: string } & { totalPurchasePrice: number },
): number => {
  const currentValue = stock.amount * getLatestPrice(stock.ticker)
  return currentValue - stock.totalPurchasePrice
}

const calculateProfitPercentage = (
  stock: Stock & { ticker: string } & { totalPurchasePrice: number },
): number => {
  return (calculateProfit(stock) / stock.totalPurchasePrice) * 100
}

const props = defineProps<{
  stock: Stock & { ticker: string } & { totalPurchasePrice: number }
}>()
</script>
