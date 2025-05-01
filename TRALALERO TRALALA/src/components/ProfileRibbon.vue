<template>
  <div class="bg-white border-b border-gray-200 p-7">
    <h1 class="text-[min(5vw,1.5rem)] max-w-fit">{{ account?.data?.id }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../supabase'
import { useRoute } from 'vue-router'

const route = useRoute()
const auth = useAuthStore()
const account = ref<any>(null)

onMounted(async () => {
  account.value = await supabase.from('profiles').select('*').eq('id', route.params.id).single()
})
</script>
