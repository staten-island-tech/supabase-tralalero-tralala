<template>
  <div class="text-center">
    <nav
      class="m-auto flex h-16 w-full max-w-7xl items-center justify-between px-2 sm:px-6 lg:px-8"
    >
      <router-link to="/" class="nav-item">Italy's Finest</router-link>

      <router-link v-if="auth.isLoggedIn" to="/profile" class="nav-item"
        ><img src="/images/profilepic.png" alt="" class="h-10 w-10"
      /></router-link>
      <div v-else>
        <router-link to="/signup">Sign Up</router-link>
        <router-link to="/login">Log In</router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
</script>

<style scoped></style>
