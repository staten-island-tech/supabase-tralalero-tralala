<template>
  <div id="chart"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { StockPoint, StockData } from '@/types/types'
import * as d3 from 'd3'
import { stocksData } from '@/stockArrays'

function stockData(): StockData {
  const symbol = Object.values(stocksData).map((data) => data['Meta Data']['2. Symbol'])
  console.log(symbol)
  const series = Object.values(stocksData).map((data) => data['Time Series (Daily)'])

  const points: StockPoint[] = Object.entries(series).map(([dateStr, values]: [string, any]) => ({
    time: new Date(dateStr),
    price: parseFloat(values['4. close']),
  }))

  points.sort((a, b) => a.time.getTime() - b.time.getTime())

  return { symbol, data: points }
}

function drawChart(stocks: StockData[]) {
  const width = 1000
  const height = 500
  const margin = { top: 20, right: 30, bottom: 30, left: 50 }

  const svg = d3.select('#chart').append('svg').attr('width', width).attr('height', height)

  const allData = stocks.flatMap((stock) => stock.data)

  const x = d3
    .scaleTime()
    .domain(d3.extent(allData, (d: StockPoint) => d.time) as [Date, Date])
    .range([margin.left, width - margin.right])

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(allData, (d: StockPoint) => d.price) ?? 0,
      d3.max(allData, (d: StockPoint) => d.price) ?? 1,
    ])
    .nice()
    .range([height - margin.bottom, margin.top])

  const line = d3
    .line<StockPoint>()
    .x((d: StockPoint) => x(d.time))
    .y((d: StockPoint) => y(d.price))

  const color = d3
    .scaleOrdinal<string>()
    .domain(stocks.map((s, index) => s.symbol[index]))
    .range(d3.schemeCategory10)

  stocks.forEach((stock, index) => {
    svg
      .append('path')
      .datum(stock.data)
      .attr('fill', 'none')
      .attr('stroke', color(stock.symbol[index])!)
      .attr('stroke-width', 1.5)
      .attr('d', line)
  })

  svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))

  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y))
}

onMounted(() => {
  const stockArray: StockData[] = [stocksData].map(stockData)
  drawChart(stockArray)
})
</script>

<style scoped></style>
