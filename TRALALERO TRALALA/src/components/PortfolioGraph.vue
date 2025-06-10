<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-800 m-4 mb-2 p-2 border-gray-200">
      Porfolio Graph:
    </h2>
    <GraphMenu @update:selected="handleSelection" />
    <div ref="chartContainer" class="bg-white rounded-lg shadow w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, computed, watch } from 'vue'
import * as d3 from 'd3'
import type { DailyStockData, StockPoint, Stock, StocksData } from '@/types/types'
import GraphMenu from '@/components/GraphMenu.vue'
import { stocksData as rawStocksData } from '@/stockArrays'

const stocksData = rawStocksData as StocksData

const props = defineProps<{
  stocks: Stock[] | null
  balance: number | null
}>()

function getTotal(stocks: Stock[] | null, balance: number | null, date: string): number {
  let stockValue = 0

  ;(stocks || []).forEach((stock) => {
    if (
      stock.date_bought &&
      stock.date_bought <= date &&
      (stock.date_sold === null || stock.date_sold > date)
    ) {
      const tickerData = stocksData[stock.ticker]
      if (tickerData) {
        const dailyData = tickerData['Time Series (Daily)']

        let foundDate = date
        while (!dailyData[foundDate] && foundDate > stock.date_bought) {
          const dateObj = new Date(foundDate)
          dateObj.setDate(dateObj.getDate() - 1)
          foundDate = dateObj.toISOString().split('T')[0]
        }

        if (dailyData[foundDate]) {
          const currentPrice = parseFloat(dailyData[foundDate]['4. close'])
          stockValue += currentPrice * stock.amount
        }
      }
    }
  })

  const total = stockValue
  return total
}

function generatePastDates(daysBack: number): string[] {
  const dates: string[] = []
  const today = new Date()

  for (let i = 0; i <= daysBack; i++) {
    const pastDate = new Date(today)
    pastDate.setDate(today.getDate() - i)

    const year = pastDate.getFullYear()
    const month = String(pastDate.getMonth() + 1).padStart(2, '0')
    const day = String(pastDate.getDate()).padStart(2, '0')

    dates.push(`${year}-${month}-${day}`)
  }

  return dates
}

const selectedValue = ref<number | null>(7)

const doneList = computed<StockPoint[]>(() => {
  if (selectedValue.value === null) return []
  const dates = generatePastDates(selectedValue.value)
  return dates
    .map((date, idx) => {
      const isToday = idx === 0
      const total = getTotal(props.stocks, isToday ? props.balance : 0, date)
      return {
        date: new Date(date),
        price: total,
      }
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
})

const handleSelection = (id: number) => {
  selectedValue.value = id
}

const chartContainer = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null
let svg: d3.Selection<SVGGElement, unknown, null, undefined> | null = null
let width = 0
const height = 390
const margin = { top: 10, right: 45, bottom: 30, left: 60 }

const drawChart = async () => {
  if (!chartContainer.value) return

  d3.select(chartContainer.value).selectAll('svg').remove()

  width = chartContainer.value.clientWidth - margin.left - margin.right

  svg = d3
    .select(chartContainer.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr(
      'viewBox',
      `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
    )
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const data = doneList.value

  if (!data || !svg || data.length === 0) return

  const extent = d3.extent(data, (d: StockPoint) => d.date)
  if (!extent[0] || !extent[1]) return

  const x = d3.scaleTime().domain([extent[0], extent[1]]).range([0, width])

  // Improved x-axis configuration
  const xAxis = d3
    .axisBottom(x)
    .ticks(selectedValue.value === 90 ? 6 : selectedValue.value === 30 ? 5 : 3) // Approximate number of ticks we want
    .tickFormat(d3.timeFormat('%b %d'))

  svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis)

  const y = d3
    .scaleLinear()
    .domain([
      (d3.min(data, (d) => d.price) as number) * 0.95,
      (d3.max(data, (d) => d.price) as number) * 1.05,
    ])
    .range([height, 0])

  svg.append('g').call(d3.axisLeft(y))

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line<StockPoint>()
        .x((d) => x(d.date))
        .y((d) => y(d.price)),
    )
}

watch(
  [doneList, chartContainer],
  () => {
    drawChart()
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  if (chartContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      drawChart()
    })
    resizeObserver.observe(chartContainer.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>
