<template>
  <div>
    <div class="flex m-auto w-full max-w-md">
      <h2 class="text-center text-xl font-semibold pb-2 m-auto my-6">
        Top 5 Stocks (the only stocks)
      </h2>
    </div>
    <div class="group relative w-full max-w-md mx-auto overflow-hidden rounded-xl">
      <div
        class="flex transition-transform duration-500"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div v-for="stock in stocks" :key="stock.ticker" class="w-full flex-shrink-0 px-4">
          <router-link
            :to="`/stock/${stock.ticker}`"
            class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform block cursor-pointer"
          >
            <img :src="stock.image" :alt="stock.name" class="w-full h-64 object-fill" />
            <div class="p-2 text-center text-sm font-semibold bg-base-300">
              {{ stock.name }}
            </div>
          </router-link>
        </div>
      </div>

      <button
        @click="prev"
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        ‹
      </button>
      <button
        @click="next"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentIndex = ref(0)

const stocks = [
  {
    ticker: 'amzn',
    name: 'Amazon',
    image: '/images/bezosososososososos.webp',
  },
  {
    ticker: 'aapl',
    name: 'Apple',
    image: '/images/ohiorizzapple.jpg',
  },
  {
    ticker: 'googl',
    name: 'Google',
    image: '/images/googleman.jpg',
  },
  {
    ticker: 'tsla',
    name: 'Tesla',
    image: '/images/poop.webp',
  },
  {
    ticker: 'nvda',
    name: 'NVIDIA',
    image: '/images/stupidgpu.jpg',
  },
]

function next() {
  if (currentIndex.value < stocks.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = stocks.length - 1
  }
}
</script>
