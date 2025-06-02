<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavRibbon from '@/components/NavRibbon.vue'
</script>

<template>
  <nav>
    <NavRibbon />
    <RouterView :key="$route.fullPath" />
  </nav>
</template>
