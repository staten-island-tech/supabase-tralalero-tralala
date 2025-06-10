<template>
  <div>
    <GraphMenu @update:selected="handleSelection" />
    <div ref="chartContainer" class="bg-white rounded-lg shadow w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, ref, onBeforeUnmount, watch } from 'vue'
import * as d3 from 'd3'
import { stocksData } from '@/stockArrays'
import type { DailyStockData, StockPoint } from '@/types/types'
import GraphMenu from '@/components/GraphMenu.vue'

const props = defineProps<{
  ticker: keyof typeof stocksData
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
  const timeSeries = rawData!['Time Series (Daily)']! as DailyStockData
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize to start of day

  const cutoffDate = getDateNDaysAgo(daysBack)

  // Convert to array and filter dates
  let data = Object.entries(timeSeries)
    .map(([timestamp, values]) => ({
      date: new Date(timestamp),
      price: parseFloat(values['4. close']),
    }))
    .filter((d) => d.date < today && d.date >= cutoffDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  // If we don't have enough data points, fill in with nearest available data
  if (data.length < daysBack) {
    const allDates = Object.keys(timeSeries)
      .map((d) => new Date(d))
      .sort((a, b) => a.getTime() - b.getTime())

    const filledData: StockPoint[] = []
    for (let i = 0; i < daysBack; i++) {
      const targetDate = getDateNDaysAgo(i)
      // Find the first date that's equal or after targetDate
      const foundDate = allDates.find((d) => d >= targetDate)
      if (foundDate) {
        const existingPoint = data.find((d) => d.date.getTime() === foundDate.getTime())
        if (existingPoint) {
          filledData.unshift(existingPoint)
        } else {
          // If not in our filtered data, get it from raw data
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
    // Remove duplicates and sort
    data = filledData
      .filter((v, i, a) => a.findIndex((t) => t.date.getTime() === v.date.getTime()) === i)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }
  console.log(data)
  return data
}

const drawChart = async () => {
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

    // Calculate interval to show approximately 5 labels
    const desiredTicks = 5
    const interval = Math.max(1, Math.floor(data.length / (desiredTicks - 1)))

    // Create a filtered list of dates for the ticks
    const tickDates = data
      .filter((_, index) => index % interval === 0 || index === data.length - 1)
      .map((d) => d.date)

    // Add x-axis with custom ticks
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

// Watch for changes in selectedValue
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
