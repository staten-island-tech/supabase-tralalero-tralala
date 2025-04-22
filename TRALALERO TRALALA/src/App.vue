<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavRibbon from './components/NavRibbon.vue'
</script>

<template @scroll.prevent @wheel.prevent @touchmove.prevent class="overflow-hidden">
  <nav>
    <NavRibbon />
    <RouterView />
  </nav>
</template>
