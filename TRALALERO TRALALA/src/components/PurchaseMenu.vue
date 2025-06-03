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
              ? '$' +
                amount *
                  stocksData[route.params.ticker]['Time Series (Daily)'][formattedDate]['4. close']
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
const amount = ref<number | null>(null)
const isLoading = ref<'buy' | 'sell' | null>(null)
const errorMessage = ref<string>()
const successMessage = ref<string>()

const today = new Date()
const formattedDate = ref(today.toISOString().split('T')[0])

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
  if (!isValidAmount.value) return

  errorMessage.value = ''

  try {
    if (amount.value <= 0) {
      throw new Error('Amount must be greater than zero')
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to complete buy order'
  }
}

const handleSell = async () => {
  if (!isValidAmount.value) return

  errorMessage.value = ''

  try {
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to complete sell order'
  }
}
</script>
