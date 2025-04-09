<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/signup">Sign Up</RouterLink>
    <RouterLink to="/login">Log In</RouterLink>
  </nav>
  <RouterView />
</template>
