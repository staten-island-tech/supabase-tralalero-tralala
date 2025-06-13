<template>
  <div class="bg-gray-800 rounded-lg shadow p-4 border border-gray-200 m-4">
    <div class="flex items-center justify-between">
      <span
        @click="router.push({ path: `/stock/${stock.ticker}`, replace: true })"
        class="font-bold text-lg text-white cursor-pointer hover:text-blue-600"
      >
        {{ stock.ticker }}
      </span>
      <span class="text-gray-300 text-sm">
        {{ stock.bought ? 'Purchased' : 'Sold' }} on {{ stock.date }}
      </span>
    </div>
    <div class="mt-2 flex justify-between items-center">
      <span :class="stock.bought ? 'text-red-400' : 'text-green-400'">
        {{ stock.amount }} share{{ stock.amount !== 1 ? 's' : '' }} at ${{
          getPrice(stock.ticker, stock.date).toFixed(2)
        }}
        each
      </span>
      <span class="text-gray-300 text-sm">
        Total: ${{ (stock.amount * getPrice(stock.ticker, stock.date)).toFixed(2) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stock, StocksData } from '@/types/types'
import { stocksData as rawStocksData } from '@/stockArrays'
import { useRouter } from 'vue-router'
const router = useRouter()

const stocksData = rawStocksData as StocksData

const props = defineProps<{
  stock: Stock
}>()

const getPrice = (ticker: string, dateStr: string): number => {
  const dailyData = stocksData[ticker]?.['Time Series (Daily)']
  if (!dailyData) return 0

  if (dailyData[dateStr]) {
    return Number(dailyData[dateStr]['4. close'])
  }

  const targetDate = new Date(dateStr)
  const dates = Object.keys(dailyData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  for (const currentDateStr of dates) {
    const currentDate = new Date(currentDateStr)
    if (currentDate <= targetDate) {
      return Number(dailyData[currentDateStr]['4. close'])
    }
  }

  return 0
}
</script>
