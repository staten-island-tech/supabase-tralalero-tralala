<template>
  <div>
    <h1 class="m-6 mb-2 font-bold text-4xl">{{ route.params.ticker }}</h1>
    <h2 class="m-8 mt-0 mb-4 text-3xl">${{ latestPrice }}</h2>
    <StockGraph :ticker="ticker" />
    <PurchaseMenu />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StockGraph from '@/components/StockGraph.vue'
import type { StocksData, ValidTicker } from '@/types/types'
import { stocksData as rawStocksData } from '@/stockArrays'
import PurchaseMenu from '@/components/PurchaseMenu.vue'

const stocksData = rawStocksData as StocksData

const route = useRoute()
const router = useRouter()

const today = new Date()
const formattedDate = ref(today.toISOString().split('T')[0])

const ticker = computed(() => {
  const t = route.params.ticker
  const tickerStr = Array.isArray(t) ? t[0] : t
  return (tickerStr || '').toUpperCase() as ValidTicker
})

const getLatestPrice = (ticker: string) => {
  const dailyData = stocksData[ticker]?.['Time Series (Daily)']
  if (!dailyData) return 'N/A'

  if (dailyData[formattedDate.value]) {
    return Number(dailyData[formattedDate.value]['4. close']).toFixed(2)
  }

  const dates = Object.keys(dailyData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  for (const date of dates) {
    if (new Date(date) <= today) {
      return Number(dailyData[date]['4. close']).toFixed(2)
    }
  }

  return 'N/A'
}

function isValidTicker(ticker: string | string[]): ticker is ValidTicker {
  const tickerStr = Array.isArray(ticker) ? ticker[0] : ticker
  return ['TSLA', 'AMZN', 'AAPL', 'GOOGL', 'NVDA'].includes(tickerStr?.toUpperCase())
}

const latestPrice = computed(() => {
  return getLatestPrice(route.params.ticker as string)
})

onMounted(() => {
  if (route.params.ticker == '') {
    router.push({ path: `/`, replace: true })
  } else if (!isValidTicker(route.params.ticker) || !stocksData[ticker.value]) {
    router.push({ path: `/`, replace: true })
  } else {
    router.push({ path: `/stock/${ticker.value}`, replace: true })
  }
})
</script>
