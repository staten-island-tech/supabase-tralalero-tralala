<template>
  <div class="bg-white border-b border-gray-200 p-7">
    <p>Purchasing Power: ${{ account?.balance }}</p>
    <p>Owned Stocks:</p>
    <p
      v-for="stock in unsoldStocks"
      :key="stock.id"
    >
      {{ stock.share_amount }} of {{ stock.ticker }} bought at {{ stock.date_bought }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../supabase'
import { useRoute } from 'vue-router'
import type { AppUser, Stock } from '@/types/types'

const route = useRoute()
const auth = useAuthStore()
const account = ref<AppUser | null>(null)

onMounted(async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (error) {
    console.error('Error fetching account:', error)
    return
  }

  account.value = data
  console.log(data)
})

const unsoldStocks = computed(() => {
  return account.value?.stocks?.filter((s: Stock) => s.time_sold === null) || []
})
</script>
