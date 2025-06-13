<template>
  <div>
    <PopularStocks />
    <MoneyCards v-if="auth.id" />
  </div>
</template>

<script setup lang="ts">
import PopularStocks from '@/components/PopularStocks.vue'
import MoneyCards from '@/components/MoneyCards.vue'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
</script>
