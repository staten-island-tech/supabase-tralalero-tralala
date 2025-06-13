<template>
  <div class="w-full max-w-md m-auto">
    <div class="card bg-base-300 text-[#50fa7b] shadow-lg border border-[#50fa7b] m-8">
      <div class="card-body text-center">
        <p class="text-base text-[#f8f8f2]">Cash Balance</p>
        <h2 class="text-3xl font-bold">${{ (Math.floor(liquidMoney * 100) / 100).toFixed(2) }}</h2>
      </div>
    </div>

    <div class="card bg-base-300 text-[#8be9fd] shadow-lg border border-[#8be9fd] m-8">
      <div class="card-body text-center">
        <p class="text-base text-[#f8f8f2]">Investments Value</p>
        <h2 class="text-3xl font-bold">
          ${{ (Math.floor(portfolioValue * 100) / 100).toFixed(2) }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { DailyStockData, StocksData, Stock, AppUser } from '@/types/types'
import { stocksData as rawStocksData } from '@/stockArrays'
import { useRoute, useRouter } from 'vue-router'

const stocksData = rawStocksData as StocksData
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const liquidMoney = ref<number>(0)
const loading = ref(true)
const stocksLoading = ref(true)
const account = ref<AppUser | null>(null)
const stocks = ref<Stock[]>([])

const today = new Date()
const formattedDate = ref(today.toISOString().split('T')[0])

const getLatestPrice = (ticker: string): number => {
  const dailyData = stocksData[ticker]?.['Time Series (Daily)']
  if (!dailyData) {
    console.warn(`No price data found for ticker: ${ticker}`)
    return 0
  }

  if (dailyData[formattedDate.value]) {
    return Number(dailyData[formattedDate.value]['4. close'])
  }

  const dates = Object.keys(dailyData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  const mostRecentDate = dates[0]
  if (mostRecentDate) {
    return Number(dailyData[mostRecentDate]['4. close'])
  }

  console.warn(`No valid price data for ${ticker}`)
  return 0
}

const fetchTotalBalance = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', auth.id)
    .single()

  if (error) {
    console.error('Error fetching balance:', error)
  } else {
    liquidMoney.value = data.balance
  }
}

const groupedStocks = computed(() => {
  if (!account.value?.stocks) {
    console.log('No account stocks data available')
    return []
  }

  const tickerMap: Record<
    string,
    {
      amount: number
      latestTransaction: Stock
      totalPurchasePrice: number
    }
  > = {}

  account.value.stocks.forEach((transaction) => {
    if (!tickerMap[transaction.ticker]) {
      tickerMap[transaction.ticker] = {
        amount: 0,
        latestTransaction: transaction,
        totalPurchasePrice: 0,
      }
    }

    if (transaction.bought) {
      const priceAtPurchase = getLatestPrice(transaction.ticker)
      tickerMap[transaction.ticker].amount += transaction.amount
      tickerMap[transaction.ticker].totalPurchasePrice += transaction.amount * priceAtPurchase
    } else {
      const currentAmount = tickerMap[transaction.ticker].amount
      if (currentAmount === 0) {
        return
      }

      const averagePrice = tickerMap[transaction.ticker].totalPurchasePrice / currentAmount
      tickerMap[transaction.ticker].amount = Math.max(0, currentAmount - transaction.amount)
      tickerMap[transaction.ticker].totalPurchasePrice = Math.max(
        0,
        tickerMap[transaction.ticker].totalPurchasePrice - transaction.amount * averagePrice,
      )
    }

    if (
      new Date(transaction.date) > new Date(tickerMap[transaction.ticker].latestTransaction.date)
    ) {
      tickerMap[transaction.ticker].latestTransaction = transaction
    }
  })

  const result = Object.entries(tickerMap)
    .filter(([ticker, stock]) => {
      if (stock.amount <= 0) {
        return false
      }
      return true
    })
    .map(([ticker, stock]) => ({
      ticker,
      amount: stock.amount,
    }))

  return result
})

const portfolioValue = computed(() => {
  const value = groupedStocks.value.reduce((total, stock) => {
    const latestPrice = getLatestPrice(stock.ticker)
    const stockValue = latestPrice * stock.amount
    return total + stockValue
  }, 0)

  return value
})

onMounted(async () => {
  try {
    loading.value = true
    stocksLoading.value = true

    const { data: accountData, error: accountError } = await supabase
      .from('profiles')
      .select('*, stocks(*)')
      .eq('id', auth.id)
      .single()

    if (accountError) {
      console.error('Account fetch error:', accountError)
      throw accountError
    }

    account.value = accountData
    stocks.value = accountData.stocks || []

    await fetchTotalBalance()
  } catch (error) {
    console.error('Initialization error:', error)
  } finally {
    loading.value = false
    stocksLoading.value = false
  }
})
</script>

<style scoped></style>
