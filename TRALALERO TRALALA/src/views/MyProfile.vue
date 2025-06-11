<template>
  <div>
    <div v-if="account?.id">
      <ProfileRibbon /><StatRibbon
        :balance="account?.balance ?? 0"
        :unsoldStocks="unsoldStocks"
        :totalValue="totalValue"
        :stocks="stocks"
      /><PortfolioGraph :balance="account?.balance ?? 0" :stocks="stocks" />
    </div>
    <div v-else class="flex items-center justify-center h-screen">
      <p class="text-black">Profile not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import ProfileRibbon from '@/components/ProfileRibbon.vue'
import StatRibbon from '@/components/StatRibbon.vue'
import PortfolioGraph from '@/components/PortfolioGraph.vue'
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/supabase'
import type { AppUser, StocksData, Stock } from '@/types/types'
import { stocksData as rawStocksData } from '@/stockArrays'

const stocksData = rawStocksData as StocksData

const account = ref<AppUser | null>(null)
const stocks = ref<Stock[] | null>(null)
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  if (route.params.id == '') {
    router.push({ path: `/profile/${auth.id}`, replace: true })
  }

  const { data: accountData, error: accountError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (accountError) {
    console.error('Error fetching account:', accountError)
    return
  }

  account.value = accountData

  const { data: stocksData, error: stocksError } = await supabase
    .from('stocks')
    .select('*')
    .eq('id', route.params.id)

  if (stocksError) {
    console.error('Error fetching stocks:', stocksError)
    return
  }

  stocks.value = stocksData
})

const unsoldStocks = computed<Stock[] | null>(() => {
  if (!stocks.value) return null
  return stocks.value.filter((s: Stock) => !s.bought)
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
        stockValue += currentPrice * stock.amount
      }
    }
  })

  return (stockValue + (account.value.balance || 0)).toFixed(2)
})
</script>
