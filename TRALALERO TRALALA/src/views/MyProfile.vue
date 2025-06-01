<template>
  <div><ProfileRibbon /><StatRibbon /><PortfolioGraph /></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import ProfileRibbon from '@/components/ProfileRibbon.vue'
import StatRibbon from '@/components/StatRibbon.vue'
import PortfolioGraph from '@/components/PortfolioGraph.vue'
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (route.params.id == '') {
    console.log(auth.id)
    router.push({ path: `/profile/${auth.id}`, replace: true })
  }
})
</script>
