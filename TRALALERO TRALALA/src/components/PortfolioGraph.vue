<template>
  <div>
    <h2 class="text-xl font-semibold m-4 mb-2 p-2">Porfolio Graph:</h2>
    <GraphMenu @update:selected="handleSelection" />
    <div
      ref="chartContainer"
      class="bg-base-300 rounded-lg shadow-lg w-full p-2 border border-gray-700"
    ></div>
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

let tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined> | null = null
let focusCircle: d3.Selection<SVGCircleElement, unknown, null, undefined> | null = null
let focusLine: d3.Selection<SVGLineElement, unknown, null, undefined> | null = null

const drawChart = async () => {
  if (!chartContainer.value) return

  d3.select(chartContainer.value).selectAll('svg').remove()

  if (!tooltip) {
    tooltip = d3
      .select(chartContainer.value)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', '#282a36')
      .style('color', '#f8f8f2')
      .style('padding', '6px 10px')
      .style('border', '1px solid #6272a4')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('font-family', 'sans-serif')
      .style('font-size', '12px')
      .style('box-shadow', '0 1px 3px rgba(0,0,0,0.3)')
      .style('z-index', '10')
  }

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
    .selectAll('path, line')
    .attr('stroke', '#6272a4')
    .attr('stroke-opacity', '0.5')

  svg.selectAll('.tick text').attr('fill', '#f8f8f2')

  const y = d3
    .scaleLinear()
    .domain([
      (d3.min(data, (d) => d.price) as number) * 0.95,
      (d3.max(data, (d) => d.price) as number) * 1.05,
    ])
    .range([height, 0])

  svg
    .append('g')
    .call(d3.axisLeft(y))
    .selectAll('path, line')
    .attr('stroke', '#6272a4')
    .attr('stroke-opacity', '0.5')

  svg.selectAll('.tick text').attr('fill', '#f8f8f2')

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#50fa7b')
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .line<StockPoint>()
        .x((d) => x(d.date))
        .y((d) => y(d.price)),
    )

  focusCircle = svg
    .append('circle')
    .attr('r', 5)
    .attr('fill', '#ff79c6')
    .attr('stroke', '#282a36')
    .attr('stroke-width', 2)
    .style('opacity', 0)

  focusLine = svg
    .append('line')
    .attr('class', 'focus-line')
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', '#ff79c6')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')
    .style('opacity', 0)

  svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout)

  function mouseover() {
    focusCircle?.style('opacity', 1)
    focusLine?.style('opacity', 1)
    tooltip?.style('opacity', 1)
  }

  function mousemove(event: MouseEvent) {
    if (!focusCircle || !focusLine || !tooltip || !chartContainer.value) return

    const [mouseX] = d3.pointer(event)
    const x0 = x.invert(mouseX)
    const bisectDate = d3.bisector<StockPoint, Date>((d) => d.date).left
    const i = bisectDate(data, x0, 1)
    const d0 = data[i - 1]
    const d1 = data[i]
    if (!d0 || !d1) return

    const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0

    focusCircle.attr('cx', x(d.date)).attr('cy', y(d.price)).style('opacity', 1)
    focusLine.attr('x1', x(d.date)).attr('x2', x(d.date)).style('opacity', 1)

    const tooltipX = x(d.date) + margin.left
    const tooltipY = y(d.price) + 500

    const containerRect = chartContainer.value.getBoundingClientRect()
    const maxX = containerRect.width - 100
    const maxY = containerRect.height - 50

    const adjustedX = tooltipX
    const adjustedY = tooltipY

    tooltip
      .html(`<strong>${d3.timeFormat('%b %d, %Y')(d.date)}</strong><br/>$${d.price.toFixed(2)}`)
      .style('left', `${adjustedX}px`)
      .style('top', `${adjustedY}px`)
  }

  function mouseout() {
    focusCircle?.style('opacity', 0)
    focusLine?.style('opacity', 0)
    tooltip?.style('opacity', 0)
  }
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
  if (tooltip) {
    tooltip.remove()
  }
})
</script>

<style>
.tooltip {
  transition: opacity 0.15s ease;
  pointer-events: none;
  position: absolute;
  white-space: nowrap;
}
</style>
