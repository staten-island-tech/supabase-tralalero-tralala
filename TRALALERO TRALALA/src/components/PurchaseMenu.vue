<template>
  <div class="bg-white flex flex-col p-4 mt-4 border border-gray-200 rounded-lg shadow-sm relative">
    <div
      v-if="!auth.id"
      class="absolute inset-0 bg-gray-400 bg-opacity-70 z-10 rounded-lg flex items-center justify-center"
    >
      <p class="text-white font-medium">Please log in to trade</p>
    </div>

    <h2 class="text-xl font-medium mb-4 text-gray-900">Trade Menu</h2>

    <div class="">
      <div class="mb-2">
        <input
          v-model.number="amount"
          type="number"
          placeholder="Share Amount"
          min="1"
          alt="Share Amount"
          :disabled="!auth.id"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:opacity-70"
        />
      </div>
      <div class="mb-2">
        <input
          :value="
            amount > 0
              ? '$' + Math.floor(amount * getLatestPrice(route.params.ticker as string) * 100) / 100
              : ''
          "
          type="text"
          placeholder="Price"
          alt="Price of Shares"
          :disabled="true"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
        />
      </div>

      <div class="flex space-x-3">
        <button
          @click="handleBuy"
          :disabled="!isValidAmount || !auth.id"
          class="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          Buy
        </button>

        <button
          @click="handleSell"
          :disabled="!isValidAmount || !auth.id"
          class="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          Sell
        </button>
      </div>

      <div
        v-if="errorMessage"
        class="p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm"
      >
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabase'
import { stocksData as rawStocksData } from '@/stockArrays'
import { useAuthStore } from '../stores/authStore'
import type { AppUser, StocksData } from '@/types/types'
import { useRoute } from 'vue-router'
const route = useRoute()

const stocksData = rawStocksData as StocksData

const account = ref<AppUser | null>(null)
const auth = useAuthStore()
console.log('Auth Store:', auth.id)
const amount = ref<number>(0)
const isLoading = ref<'buy' | 'sell' | null>(null)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string>()

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

const isValidAmount = computed(() => {
  return amount.value !== null && amount.value > 0
})

onMounted(async () => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', auth.id).single()

  if (error) {
    console.error('Error fetching account:', error)
    return
  }

  account.value = data
})

const handleBuy = async () => {
  if (!isValidAmount.value || !auth.id) return

  errorMessage.value = ''
  successMessage.value = ''

  const ticker = Array.isArray(route.params.ticker) ? route.params.ticker[0] : route.params.ticker

  const date = Array.isArray(formattedDate.value) ? formattedDate.value[0] : formattedDate.value

  try {
    if (amount.value <= 0) {
      throw new Error('Amount must be greater than zero')
    }

    const pricePerShare = getLatestPrice(ticker)
    if (pricePerShare <= 0) {
      throw new Error('Could not retrieve stock price')
    }

    const stockTotalPrice = amount.value * pricePerShare

    if (!account.value) {
      throw new Error('Account information not available')
    }

    if (account.value.balance < stockTotalPrice) {
      throw new Error('Insufficient funds for this purchase')
    }

    isLoading.value = 'buy'

    const { error: tradeError } = await supabase.from('stocks').insert({
      ticker: ticker,
      amount: amount.value,
      date: date,
      bought: true,
      id: auth.id,
    })

    if (tradeError) throw tradeError

    const { error: balanceError } = await supabase
      .from('profiles')
      .update({
        balance: account.value.balance - stockTotalPrice,
      })
      .eq('id', auth.id)

    if (balanceError) throw balanceError

    account.value.balance -= stockTotalPrice
    successMessage.value = `Successfully bought ${amount.value} shares of ${ticker} at $${pricePerShare.toFixed(2)} each`
    amount.value = 0
  } catch (error) {
    console.error('Buy error:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to complete buy order'
  } finally {
    isLoading.value = null
  }
}

const handleSell = async () => {
  if (!isValidAmount.value || !auth.id) return

  errorMessage.value = ''
  successMessage.value = ''

  const ticker = Array.isArray(route.params.ticker) ? route.params.ticker[0] : route.params.ticker
  const date = Array.isArray(formattedDate.value) ? formattedDate.value[0] : formattedDate.value

  try {
    if (amount.value <= 0) {
      throw new Error('Amount must be greater than zero')
    }

    const pricePerShare = getLatestPrice(ticker)
    if (pricePerShare <= 0) {
      throw new Error('Could not retrieve stock price')
    }

    const stockTotalPrice = amount.value * pricePerShare

    const { data: boughtData, error: boughtError } = await supabase
      .from('stocks')
      .select('amount')
      .eq('ticker', ticker)
      .eq('id', auth.id)
      .eq('bought', true)

    if (boughtError) throw boughtError

    const { data: soldData, error: soldError } = await supabase
      .from('stocks')
      .select('amount')
      .eq('ticker', ticker)
      .eq('id', auth.id)
      .eq('bought', false)

    if (soldError) throw soldError

    const totalBought = boughtData.reduce((sum, holding) => sum + holding.amount, 0)
    const totalSold = soldData.reduce((sum, holding) => sum + holding.amount, 0)
    const availableShares = totalBought - totalSold

    if (availableShares < amount.value) {
      throw new Error(`Insufficient shares to sell. You have ${availableShares} shares available.`)
    }

    isLoading.value = 'sell'

    const { error: tradeError } = await supabase.from('stocks').insert({
      ticker: ticker,
      amount: amount.value,
      date: date,
      bought: false,
      id: auth.id,
    })

    if (tradeError) throw tradeError

    const { error: balanceError } = await supabase
      .from('profiles')
      .update({
        balance: account.value.balance + stockTotalPrice,
      })
      .eq('id', auth.id)

    if (balanceError) throw balanceError

    account.value.balance += stockTotalPrice
    successMessage.value = `Successfully sold ${amount.value} shares of ${ticker} at $${pricePerShare.toFixed(2)} each`
    amount.value = 0
  } catch (error) {
    console.error('Sell error:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to complete sell order'
  } finally {
    isLoading.value = null
  }
}
</script>
