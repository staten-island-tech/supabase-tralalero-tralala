<template>
  <div>
    <div v-if="sold == null" class="bg-white rounded-lg shadow p-4 border border-gray-200 m-4">
      <div class="flex items-center justify-between">
        <span class="font-bold text-lg">{{ stock.ticker }}</span>
        <span class="text-gray-500 text-sm">{{ stock.date_bought }}</span>
      </div>
      <div class="mt-2">
        <span class="text-gray-700"
          >{{ stock.share_amount }} share{{ stock.share_amount !== 1 ? 's' : '' }}</span
        >
      </div>
    </div>
    <div v-else-if="show" class="bg-gray-100 rounded-lg shadow p-4 border border-gray-200 m-4">
      <div class="flex items-center justify-between">
        <span class="font-bold text-lg">{{ stock.ticker }}</span>
        <span class="text-gray-500 text-sm">{{ stock.date_bought }}</span>
      </div>
      <div class="mt-2 flex justify-between items-end">
        <span class="text-gray-700">
          {{ stock.share_amount }} share{{ stock.share_amount !== 1 ? 's' : '' }}
        </span>
        <span class="text-gray-500 text-sm">Sold: {{ sold }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stock } from '@/types/types'

defineProps<{
  stock: Stock
  sold: string | null
  show: boolean
}>()
</script>
