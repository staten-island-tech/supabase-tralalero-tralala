<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-800 m-4 p-2 border-gray-200">Porfolio Graph:</h2>
    <div ref="chartContainer" class="bg-white rounded-lg shadow w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, ref, onBeforeUnmount } from 'vue'
import * as d3 from 'd3'
import { handleFetch } from '../handleFetch'
import { stocksData } from '@/stockArrays'
import type { DailyStockData, StockPoint } from '@/types/types'

const chartContainer = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null
let svg: d3.Selection<SVGGElement, unknown, null, undefined> | null = null
let width = 0
const height = 390
const margin = { top: 10, right: 30, bottom: 30, left: 60 }

const processData = (rawData: any): StockPoint[] => {
  const timeSeries = rawData['Time Series (Daily)'] as DailyStockData
  return Object.entries(timeSeries)
    .map(([timestamp, values]) => ({
      date: new Date(timestamp),
      price: parseFloat(values['4. close']),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

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

  try {
    const rawData = stocksData.AAPL

    const data = processData(rawData)

    if (!data || !svg) return

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, width])

    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

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
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line<StockPoint>()
          .x((d) => x(d.date))
          .y((d) => y(d.price)),
      )

    svg
      .append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.date))
      .attr('cy', (d) => y(d.price))
      .attr('r', 2)
      .attr('fill', 'steelblue')
  } catch (error) {
    console.error('Error loading or processing data:', error)
  }
}

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
