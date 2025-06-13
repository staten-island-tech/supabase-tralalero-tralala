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
          ${{ (Math.floor(totalInvestmentsValue * 100) / 100).toFixed(2) }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { DailyStockData, StocksData } from '@/types/types'
import { stocksData as rawStocksData } from '@/stockArrays'

const stocksData = rawStocksData as StocksData

const auth = useAuthStore()

const liquidMoney = ref<number>(0)
const totalInvestmentsValue = ref<number>(0)

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

const fetchTotalStockValue = async () => {
  const { data: stocks, error } = await supabase
    .from('stocks')
    .select('amount, ticker, bought')
    .eq('id', auth.id)
    .eq('bought', true)
  if (error) {
    console.error('Error fetching stocks:', error)
    return
  }
  const totalStockValue = ref(0)
  for (const stock of stocks) {
    const price = getLatestPrice(stock.ticker)
    totalStockValue.value += stock.amount * price
  }
  totalInvestmentsValue.value = totalStockValue.value
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

onMounted(() => {
  fetchTotalBalance()
  fetchTotalStockValue()
})
</script>

<style scoped></style>
