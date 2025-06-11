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

let tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined> | null = null
let focusCircle: d3.Selection<SVGCircleElement, unknown, null, undefined> | null = null
let focusLine: d3.Selection<SVGLineElement, unknown, null, undefined> | null = null

const getDateNDaysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const processData = (rawData: any, daysBack: number): StockPoint[] => {
  const timeSeries = rawData!['Time Series (Daily)']! as DailyStockData
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const cutoffDate = getDateNDaysAgo(daysBack)

  const allDates = Object.keys(timeSeries)
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime())

  const result: StockPoint[] = []
  for (let i = 0; i < daysBack; i++) {
    const targetDate = getDateNDaysAgo(i)

    let foundDate: Date | null = null
    for (let j = allDates.length - 1; j >= 0; j--) {
      if (allDates[j] <= targetDate) {
        foundDate = allDates[j]
        break
      }
    }

    if (foundDate) {
      const dateStr = foundDate.toISOString().split('T')[0]
      if (timeSeries[dateStr]) {
        result.unshift({
          date: targetDate,
          price: parseFloat(timeSeries[dateStr]['4. close']),
        })
      }
    }
  }

  if (result.length > 0 && result.length < daysBack) {
    const earliestDateInResult = result[0].date
    const earliestAvailableDate = allDates[0]

    if (earliestAvailableDate < earliestDateInResult) {
      const dateStr = earliestAvailableDate.toISOString().split('T')[0]
      result.unshift({
        date: earliestAvailableDate,
        price: parseFloat(timeSeries[dateStr]['4. close']),
      })
    }
  }

  return result
}

const drawChart = async () => {
  if (!chartContainer.value || selectedValue.value === null) return

  d3.select(chartContainer.value).selectAll('svg').remove()

  if (!tooltip) {
    tooltip = d3
      .select(chartContainer.value)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'white')
      .style('padding', '6px 10px')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('font-family', 'sans-serif')
      .style('font-size', '12px')
      .style('box-shadow', '0 1px 3px rgba(0,0,0,0.1)')
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

    focusCircle = svg
      .append('circle')
      .attr('r', 5)
      .attr('fill', 'steelblue')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0)

    focusLine = svg
      .append('line')
      .attr('class', 'focus-line')
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'steelblue')
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
      const tooltipY = y(d.price) + margin.top + 150

      const containerRect = chartContainer.value.getBoundingClientRect()
      const maxX = containerRect.width - 100
      const maxY = containerRect.height - 50

      const adjustedX = Math.min(Math.max(tooltipX, 10), maxX)
      const adjustedY = Math.min(Math.max(tooltipY, 10), maxY)

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
