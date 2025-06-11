<template>
  <div>
    <div class="flex flex-wrap justify-center gap-6 p-4">
      <router-link
        to="/stock/amzn"
        class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white w-40 sm:w-48 md:w-56 lg:w-64"
      >
        <img
          src="/images/bezosososososososos.webp"
          alt="Amazon"
          class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-fill"
        />
        <div class="p-2 text-center text-sm font-semibold text-gray-800">Amazon</div>
      </router-link>

      <router-link
        to="/stock/aapl"
        class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white w-40 sm:w-48 md:w-56 lg:w-64"
      >
        <img
          src="/images/ohiorizzapple.jpg"
          alt="Apple"
          class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-fill"
        />
        <div class="p-2 text-center text-sm font-semibold text-gray-800">Apple</div>
      </router-link>

      <router-link
        to="/stock/googl"
        class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white w-40 sm:w-48 md:w-56 lg:w-64"
      >
        <img
          src="/images/googleman.jpg"
          alt="Google"
          class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-fill"
        />
        <div class="p-2 text-center text-sm font-semibold text-gray-800">Google</div>
      </router-link>

      <router-link
        to="/stock/tsla"
        class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white w-40 sm:w-48 md:w-56 lg:w-64"
      >
        <img
          src="/images/poop.jfif"
          alt="Tesla"
          class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-fill"
        />
        <div class="p-2 text-center text-sm font-semibold text-gray-800">Tesla</div>
      </router-link>

      <router-link
        to="/stock/nvda"
        class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white w-40 sm:w-48 md:w-56 lg:w-64"
      >
        <img
          src="/images/stupidgpu.jpg"
          alt="NVIDIA"
          class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-fill"
        />
        <div class="p-2 text-center text-sm font-semibold text-gray-800">NVIDIA</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, ref, onBeforeUnmount, watch } from 'vue'
import * as d3 from 'd3'
import { stocksData } from '@/stockArrays'
import type { DailyStockData, StockPoint } from '@/types/types'
import GraphMenu from '@/components/GraphMenu.vue'

const props = defineProps<{
  ticker: string
}>()

const selectedValue = ref<number | null>(7)

const handleSelection = (id: number) => {
  selectedValue.value = id
}

const chartContainer = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null
let svg: d3.Selection<SVGGElement, unknown, null, undefined> | null = null
let width = 0
const height = 390
const margin = { top: 10, right: 30, bottom: 30, left: 60 }

// Helper function to get the date N days ago from today
const getDateNDaysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const processData = (rawData: any, daysBack: number): StockPoint[] => {
  const timeSeries = rawData['Time Series (Daily)'] as DailyStockData
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const cutoffDate = getDateNDaysAgo(daysBack)

  let data = Object.entries(timeSeries)
    .map(([timestamp, values]) => ({
      date: new Date(timestamp),
      price: parseFloat(values['4. close']),
    }))
    .filter((d) => d.date < today && d.date >= cutoffDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  if (data.length < daysBack) {
    const allDates = Object.keys(timeSeries)
      .map((d) => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime())

    const filledData: StockPoint[] = []
    for (let i = 0; i < daysBack; i++) {
      const targetDate = getDateNDaysAgo(i)

      const foundDate = allDates.find((d) => d >= targetDate)
      if (foundDate) {
        const existingPoint = data.find((d) => d.date.getTime() === foundDate.getTime())
        if (existingPoint) {
          filledData.unshift(existingPoint)
        } else {
          const dateStr = foundDate.toISOString().split('T')[0]
          if (timeSeries[dateStr]) {
            filledData.unshift({
              date: foundDate,
              price: parseFloat(timeSeries[dateStr]['4. close']),
            })
          }
        }
      }
    }

    data = filledData
      .filter((v, i, a) => a.findIndex((t) => t.date.getTime() === v.date.getTime()) === i)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  return data
}

const drawChart = () => {
  if (!chartContainer.value || selectedValue.value === null) return

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

  try {
    const rawData = stocksData[props.ticker]
    const data = processData(rawData, selectedValue.value)

    if (!data || !svg || data.length === 0) return

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, width])

    const desiredTicks = 5
    const interval = Math.max(1, Math.floor(data.length / (desiredTicks - 1)))

    const tickDates = data
      .filter((_, index) => index % interval === 0 || index === data.length - 1)
      .map((d) => d.date)

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(tickDates)
          .tickFormat(d3.timeFormat('%b %d') as any),
      )

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
  } catch (error) {
    console.error('Error loading or processing data:', error)
  }
}

watch(selectedValue, () => {
  drawChart()
})

onMounted(() => {
  drawChart()

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
