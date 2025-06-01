<template>
  <div>
    <h1 class="m-6 mb-2 font-bold text-4xl">{{ route.params.ticker }}</h1>
    <h2 class="m-8 mt-0 mb-4 text-3xl">
      ${{
        stocksData[route.params.ticker]?.['Time Series (Daily)']?.[formattedDate]?.['4. close']
          ? Number(
              stocksData[route.params.ticker]['Time Series (Daily)'][formattedDate]['4. close'],
            ).toFixed(2)
          : 'N/A'
      }}
    </h2>
    <StockGraph :ticker="route.params.ticker" />
    <PurchaseMenu />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StockGraph from '@/components/StockGraph.vue'
import type { StocksData } from '@/types/types'
import { stocksData as rawStocksData } from '@/stockArrays'
import PurchaseMenu from '@/components/PurchaseMenu.vue'

const stocksData = rawStocksData as StocksData

const route = useRoute()
const router = useRouter()

const today = new Date()
const formattedDate = ref(today.toISOString().split('T')[0])

onMounted(() => {
  if (route.params.ticker == '') {
    router.push({ path: `/`, replace: true })
  } else if (!stocksData[route.params.ticker.toUpperCase()]) {
    router.push({ path: `/`, replace: true })
  } else {
    router.push({ path: `/stock/${route.params.ticker.toUpperCase()}`, replace: true })
  }
})
</script>
