<template>
  <div>
    <h2 class="text-xl font-semibold pb-2">Owned Stocks:</h2>
    <template v-if="Object.keys(groupedStocks).length > 0">
      <PurchaseCard
        v-for="(stockData, ticker) in groupedStocks"
        :key="ticker"
        :stock="{
          ...stockData.latestTransaction,
          ticker: ticker,
          amount: stockData.amount,
        }"
      />
    </template>
    <p v-else>&emsp;No stocks owned</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  ownedStocks: Stock[] | null
}>()

const groupedStocks = computed(() => {
  if (!props.ownedStocks) return {}

  const tickerMap: Record<
    string,
    {
      amount: number
      latestTransaction: Stock
    }
  > = {}

  props.ownedStocks.forEach((transaction) => {
    if (!tickerMap[transaction.ticker]) {
      tickerMap[transaction.ticker] = {
        amount: 0,
        latestTransaction: transaction,
      }
    }

    if (transaction.bought) {
      tickerMap[transaction.ticker].amount += transaction.amount
    } else {
      tickerMap[transaction.ticker].amount = Math.max(
        0,
        tickerMap[transaction.ticker].amount - transaction.amount,
      )
    }

    if (
      new Date(transaction.date) > new Date(tickerMap[transaction.ticker].latestTransaction.date)
    ) {
      tickerMap[transaction.ticker].latestTransaction = transaction
    }
  })

  Object.keys(tickerMap).forEach((ticker) => {
    if (tickerMap[ticker].amount <= 0) {
      delete tickerMap[ticker]
    }
  })

  return tickerMap
})
</script>
