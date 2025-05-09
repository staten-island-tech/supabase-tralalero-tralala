<template>
  <div class="p-4">
    <div id="my_dataviz" ref="chartContainer" class="bg-white rounded-lg shadow p-4"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as d3 from 'd3';

interface DataPoint {
  date: Date;
  value: number;
}

export default defineComponent({
  name: 'LineChart',
  setup() {
    const chartContainer = ref<HTMLElement | null>(null);

    onMounted(() => {
      if (!chartContainer.value) return;

      // Set the dimensions and margins of the graph
      const margin = { top: 10, right: 30, bottom: 30, left: 60 };
      const width = 300 - margin.left - margin.right;
      const height = 390 - margin.top - margin.bottom;

      // Append the svg object to the div
      const svg = d3.select(chartContainer.value)
        .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .attr('class', 'w-full h-auto') // Make responsive with Tailwind
        .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

      // Read the data
      d3.csv<DataPoint>(
        'https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv',
        // Format variables
        (d) => ({
          date: d3.timeParse('%Y-%m-%d')(d.date) as Date,
          value: +d.value
        })
      ).then((data) => {
        if (!data) return;

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
    });

    return {
      chartContainer
    };
  }
});
</script>