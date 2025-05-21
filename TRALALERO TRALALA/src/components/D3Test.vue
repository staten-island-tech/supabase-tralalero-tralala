<template>
  <div class="p-4">
    <div id="my_dataviz" ref="chartContainer" class="bg-white rounded-lg shadow p-4 w-full"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onBeforeUnmount } from 'vue';
import * as d3 from 'd3';

interface DataPoint {
  date: Date;
  value: number;
}

interface StockData {
  [timestamp: string]: {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  };
}

export default defineComponent({
  name: 'LineChart',
  setup() {
    const chartContainer = ref<HTMLElement | null>(null);
    let resizeObserver: ResizeObserver | null = null;
    let svg: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
    let width = 0;
    const height = 390; // Fixed height
    const margin = { top: 10, right: 30, bottom: 30, left: 60 };

    // Variable data link (could be passed as prop in real implementation)
    const dataLink = ref('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=BTC&interval=15min&apikey=B6S0LQO8ZSN31GKX');

    const processData = (rawData: any): DataPoint[] => {
      const timeSeries = rawData['Time Series (15min)'] as StockData;
      return Object.entries(timeSeries).map(([timestamp, values]) => ({
        date: new Date(timestamp),
        value: parseFloat(values['4. close'])
      })).sort((a, b) => a.date.getTime() - b.date.getTime());
    };

    const drawChart = async () => { 
      if (!chartContainer.value) return;

      // Clear previous SVG if it exists
      d3.select(chartContainer.value).selectAll('svg').remove();

      // Get the container's width
      width = chartContainer.value.clientWidth - margin.left - margin.right;

      // Append the svg object to the div
      svg = d3.select(chartContainer.value)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      try {

        const response = await fetch(dataLink.value);
        const rawData = await response.json();
        

        const data = processData(rawData);

        if (!data || !svg) return;

        // Add X axis
        const x = d3.scaleTime()
          .domain(d3.extent(data, (d) => d.date) as [Date, Date])
          .range([0, width]);

        svg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
          .domain([d3.min(data, (d) => d.value) as number * 0.95, d3.max(data, (d) => d.value) as number * 1.05])
          .range([height, 0]);

        svg.append('g')
          .call(d3.axisLeft(y));

        // Add the line
        svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 1.5)
          .attr('d', d3.line<DataPoint>()
            .x((d) => x(d.date))
            .y((d) => y(d.value))
          );

        // Add dots for each data point
        svg.append('g')
          .selectAll('dot')
          .data(data)
          .enter()
          .append('circle')
          .attr('cx', (d) => x(d.date))
          .attr('cy', (d) => y(d.value))
          .attr('r', 2)
          .attr('fill', 'steelblue');

      } catch (error) {
        console.error('Error loading or processing data:', error);
      }
    };

    onMounted(() => {
      drawChart();

      // Set up resize observer to redraw chart when container size changes
      if (chartContainer.value) {
        resizeObserver = new ResizeObserver(() => {
          drawChart();
        });
        resizeObserver.observe(chartContainer.value);
      }
    });

    onBeforeUnmount(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    });

    return {
      chartContainer
    };
  }
});
</script>