<template>
  <div id="chart"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as d3 from 'd3'

type StockPoint = {
  time: Date
  price: number
}

type StockData = {
  symbol: string
  data: StockPoint[]
}

const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'TSM', 'V', 'JNJ']
const apiKey = 'B6S0LQO8ZSN31GKX'
const baseUrl = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact'

async function fetchData(): Promise<StockData[]> {
  try {
    const responses = await Promise.all(
      symbols.map((symbol) => fetch(`${baseUrl}&symbol=${symbol}&apikey=${apiKey}`)),
    )

    responses.forEach((response) => {
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    })

    const jsonData = await Promise.all(responses.map((res) => res.json()))

    return symbols.map((symbol, i) => {
      console.log(jsonData[i])
      const timeSeries = jsonData[i]['Time Series (Daily)']
      if (!timeSeries) throw new Error(`Missing time series data for ${symbol}`)

      const data: StockPoint[] = Object.entries(timeSeries).map(([time, values]) => ({
        time: new Date(time),
        price: parseFloat((values as any)['4. close']),
      }))

      data.sort((a, b) => a.time.getTime() - b.time.getTime())

      return { symbol, data }
    })
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
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
    .domain(stocks.map((s) => s.symbol))
    .range(d3.schemeCategory10)

  // Draw lines
  stocks.forEach((stock) => {
    svg
      .append('path')
      .datum(stock.data)
      .attr('fill', 'none')
      .attr('stroke', color(stock.symbol)!)
      .attr('stroke-width', 1.5)
      .attr('d', line)
  })

  // Axes
  svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))

  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y))
}

onMounted(async () => {
  try {
    const stockData = await fetchData()
    drawChart(stockData)
  } catch (e) {
    console.error('Error rendering chart:', e)
  }
})
</script>

<style scoped></style>
