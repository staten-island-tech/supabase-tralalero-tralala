<template>
  <div>
    <div class="bg-white border-b border-gray-200 p-7">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-gray-200">
        Value Information:
      </h2>
      <p class="text-lg">Portfolio Value (including PP): ${{ totalValue }}</p>
      <p class="text-lg mb-1">Purchasing Power: ${{ account?.balance }}</p>
    </div>
    <div class="bg-white border-b border-gray-200 p-7">
      <OwnedStocks :ownedStocks="account?.stocks || []" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import OwnedStocks from '@/components/OwnedStocks.vue'
import { supabase } from '@/supabase'
import { useRoute } from 'vue-router'
import type { AppUser, Stock, StocksData } from '@/types/types'
import { stocksData as rawStocksData } from '@/stockArrays'

const stocksData = rawStocksData as StocksData

const route = useRoute()
const account = ref<AppUser | null>(null)

onMounted(async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (error) {
    console.error('Error fetching account:', error)
    return
  }

  account.value = data
})

const unsoldStocks = computed<Stock[] | null>(() => {
  if (!account.value?.stocks) return null
  return account.value.stocks.filter((s: Stock) => s.date_sold === null)
})

const totalValue = computed(() => {
  if (!account.value) return '0.00'

  let stockValue = 0

  ;(unsoldStocks.value || []).forEach((stock) => {
    const tickerData = stocksData[stock.ticker]
    if (tickerData) {
      const days = Object.keys(tickerData['Time Series (Daily)'])
      const mostRecentDay = days[0]
      const mostRecentData = tickerData['Time Series (Daily)'][mostRecentDay]

      if (mostRecentData) {
        const currentPrice = parseFloat(mostRecentData['4. close'])
        stockValue += currentPrice * stock.share_amount
      }
    }
  })

  return (stockValue + (account.value.balance || 0)).toFixed(2)
})
</script>
