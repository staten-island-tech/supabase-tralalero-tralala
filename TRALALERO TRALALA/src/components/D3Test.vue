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

export default defineComponent({
  name: 'LineChart',
  setup() {
    const chartContainer = ref<HTMLElement | null>(null);
    let resizeObserver: ResizeObserver | null = null;
    let svg: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
    let width = 0;
    const height = 390; // Fixed height
    const margin = { top: 10, right: 30, bottom: 30, left: 60 };

    const drawChart = () => { 
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

      // Read the data
      d3.csv<DataPoint>(
        'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv',
        (d: DataPoint) => ({
          date: d3.timeParse('%Y-%m-%d')(d.date) as Date,
          value: +d.value
        })
      ).then((data: DataPoint[]) => {
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
          .domain([0, d3.max(data, (d) => d.value) as number])
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
      });
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