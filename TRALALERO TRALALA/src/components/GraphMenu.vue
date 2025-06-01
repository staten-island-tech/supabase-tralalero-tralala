<template>
  <div class="flex ml-8 mb-4">
    <button
      v-for="(button, index) in buttons"
      :key="button.id"
      @click="selectButton(button.id)"
      :class="[
        'px-3 py-1 border border-gray-300 focus:outline-none text-xs',
        {
          'bg-gray-700 text-white': selectedButton === button.id,
          'bg-white text-gray-800 hover:bg-gray-100': selectedButton !== button.id,
          'rounded-l-lg': index === 0,
          'rounded-r-lg': index === buttons.length - 1,
          'border-l-0': index !== 0,
        },
      ]"
    >
      {{ button.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'update:selected', id: number): void
}>()

const buttons = [
  { id: 90, label: '3m' },
  { id: 30, label: '1m' },
  { id: 7, label: '1w' },
]

const selectedButton = ref<number | null>(7)

interface Button {
  id: number
  label: string
}

const selectButton = (id: Button['id']): void => {
  selectedButton.value = id
  emit('update:selected', id)
}
</script>
