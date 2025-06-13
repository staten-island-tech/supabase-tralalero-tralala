<template>
  <div>
    <PopularStocks />
    <MoneyCards v-if="auth.isLoggedIn" />
    <div v-else></div>
  </div>
</template>

<script setup lang="ts">
import PopularStocks from '@/components/PopularStocks.vue'
import MoneyCards from '@/components/MoneyCards.vue'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()

const doSomething = () => {
  console.log('Doing something only a logged-in user can do!')
}
</script>
