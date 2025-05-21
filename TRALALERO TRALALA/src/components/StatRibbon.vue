<template>
  <div class="bg-white border-b border-gray-200 p-7">
    <p>Purchasing Power: ${{ account?.data?.balance }}</p>
    <p>Owned Stocks:</p>
    <!-- (ticker, share_amount, time_bought, time_sold:null) -->
    <p v-for="stock in account?.data?.stocks.filter((s: any) => s.time_sold === null)">
      {{ stock.share_amount }} of {{ stock.ticker }} bought at {{ stock.time_bought }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../supabase'
import { useRoute } from 'vue-router'
import type { AppUser } from '@/types/types'

const route = useRoute()
const auth = useAuthStore()
const account = ref<AppUser | null>(null)

onMounted(async () => {
  account.value = await supabase.from('profiles').select('*').eq('id', route.params.id).single()
})
</script>
