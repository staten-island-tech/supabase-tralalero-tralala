<template>
  <div>
    <PopularStocks />
    <button v-if="auth.isLoggedIn" @click="doSomething">button</button>

    <p v-else>Please log in to access this feature.</p>
  </div>
</template>

<script setup lang="ts">
import PopularStocks from '@/components/PopularStocks.vue'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()

const doSomething = () => {
  console.log('Doing something only a logged-in user can do!')
}
</script>
