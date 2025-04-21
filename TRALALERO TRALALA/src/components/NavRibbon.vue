<template>
  <div class="bg-white border-b border-gray-200">
    <nav class="m-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 py-2">
      <router-link
        to="/"
        class="text-2xl font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200"
      >
        Italy's Finest
      </router-link>

      <div class="flex items-center space-x-4">
        <router-link
          v-if="auth.isLoggedIn"
          to="/profile"
          class="hover:opacity-80 transition-opacity duration-200"
        >
          <img
            src="/images/profilepic.png"
            alt="Profile"
            class="h-10 w-10 rounded-full border border-gray-300 object-cover"
          />
        </router-link>
        <div v-else class="flex space-x-4">
          <router-link
            to="/signup"
            class="px-4 py-2 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            Sign Up
          </router-link>
          <router-link
            to="/login"
            class="px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-200"
          >
            Log In
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
</script>
