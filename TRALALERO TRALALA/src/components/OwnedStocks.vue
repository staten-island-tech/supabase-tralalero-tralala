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
          totalPurchasePrice: stockData.totalPurchasePrice,
        }"
      />
    </template>
    <p v-else>&emsp;No stocks owned</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Stock, StocksData } from '@/types/types'
import PurchaseCard from '@/components/StockCard.vue'
import { stocksData as rawStocksData } from '@/stockArrays'

const stocksData = rawStocksData as StocksData

const props = defineProps<{
  ownedStocks: Stock[] | null
}>()

console.log(props.ownedStocks)

const getPrice = (ticker: string, dateStr: string): number => {
  const dailyData = stocksData[ticker]?.['Time Series (Daily)']
  if (!dailyData) return 0

  if (dailyData[dateStr]) {
    return Number(dailyData[dateStr]['4. close'])
  }

  const targetDate = new Date(dateStr)
  const dates = Object.keys(dailyData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  for (const currentDateStr of dates) {
    const currentDate = new Date(currentDateStr)
    if (currentDate <= targetDate) {
      return Number(dailyData[currentDateStr]['4. close'])
    }
  }

  return 0
}

const groupedStocks = computed(() => {
  if (!props.ownedStocks) return {}

  const tickerMap: Record<
    string,
    {
      amount: number
      latestTransaction: Stock
      totalPurchasePrice: number
    }
  > = {}

  props.ownedStocks.forEach((transaction) => {
    if (!tickerMap[transaction.ticker]) {
      tickerMap[transaction.ticker] = {
        amount: 0,
        latestTransaction: transaction,
        totalPurchasePrice: 0,
      }
    }

    if (transaction.bought) {
      const priceAtPurchase = getPrice(transaction.ticker, transaction.date)
      tickerMap[transaction.ticker].amount += transaction.amount
      tickerMap[transaction.ticker].totalPurchasePrice += transaction.amount * priceAtPurchase
    } else {
      const averagePrice =
        tickerMap[transaction.ticker].totalPurchasePrice / tickerMap[transaction.ticker].amount
      tickerMap[transaction.ticker].amount = Math.max(
        0,
        tickerMap[transaction.ticker].amount - transaction.amount,
      )
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

  Object.keys(tickerMap).forEach((ticker) => {
    if (tickerMap[ticker].amount <= 0) {
      delete tickerMap[ticker]
    }
  })

  return tickerMap
})
</script>
