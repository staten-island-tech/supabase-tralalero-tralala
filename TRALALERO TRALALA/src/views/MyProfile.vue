<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center h-screen">
      <p class="text-black">Loading profile data...</p>
    </div>

    <div v-else>
      <div v-if="account?.id">
        <ProfileRibbon />

        <div v-if="stocksLoading" class="text-center py-8">
          <p>Loading portfolio data...</p>
        </div>

        <template v-else>
          <StatRibbon
            :balance="account?.balance ?? 0"
            :totalValue="getTotalValue()"
            :stocks="stocks"
          />
        </template>
      </div>

      <div v-else class="flex items-center justify-center h-screen">
        <p class="text-black">Profile not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import ProfileRibbon from '@/components/ProfileRibbon.vue'
import StatRibbon from '@/components/StatRibbon.vue'
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/supabase'
import type { AppUser, StocksData, Stock } from '@/types/types'
import { stocksData as rawStocksData } from '@/stockArrays'

const stocksData = rawStocksData as StocksData

const account = ref<AppUser | null>(null)
const stocks = ref<Stock[]>([])
const loading = ref(true)
const stocksLoading = ref(true)
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  try {
    loading.value = true

    if (route.params.id == '') {
      router.push({ path: `/profile/${auth.id}`, replace: true })
    }

    const { data: accountData, error: accountError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (accountError) throw accountError
    account.value = accountData

    stocksLoading.value = true
    const { data: stocksData, error: stocksError } = await supabase
      .from('stocks')
      .select('*')
      .eq('id', route.params.id)

    if (stocksError) throw stocksError
    stocks.value = stocksData || []
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
    stocksLoading.value = false
  }
})

const today = new Date()
const formattedDate = ref(today.toISOString().split('T')[0])

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

function getTotalValue(): number {
  if (!stocks.value) return 0

  const tickerMap: Record<string, number> = {}

  stocks.value.forEach((transaction) => {
    if (!tickerMap[transaction.ticker]) {
      tickerMap[transaction.ticker] = 0
    }

    if (transaction.bought) {
      tickerMap[transaction.ticker] += transaction.amount
    } else {
      tickerMap[transaction.ticker] = Math.max(
        0,
        tickerMap[transaction.ticker] - transaction.amount,
      )
    }
  })

  let totalStocksValue = 0
  Object.keys(tickerMap).forEach((ticker) => {
    if (tickerMap[ticker] > 0) {
      const currentPrice = getLatestPrice(ticker)
      totalStocksValue += tickerMap[ticker] * currentPrice
    }
  })

  return totalStocksValue + (account.value?.balance ?? 0)
}
</script>
