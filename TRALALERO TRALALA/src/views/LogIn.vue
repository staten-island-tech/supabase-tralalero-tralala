<template>
  <div class="bg-white flex flex-col items-center justify-center p-4">
    <div
      class="w-full max-w-md border border-gray-200 rounded-lg shadow-sm py-10 px-8"
      style="min-height: 480px"
    >
      <div class="flex flex-col h-full justify-between">
        <div>
          <h2 class="text-3xl font-medium text-center mb-3 text-gray-900">Italy's Finest</h2>
          <h2 class="text-2xl font-normal mb-8 text-gray-700 text-center">Log In</h2>

          <form @submit.prevent="handleLogIn" class="space-y-5">
            <div>
              <input
                v-model="email"
                type="email"
                placeholder="Email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>

            <div>
              <input
                v-model="password"
                type="password"
                placeholder="Password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {{ isLoading ? 'Logging in...' : 'Log In' }}
            </button>
          </form>

          <div
            v-if="errorMessage"
            class="mt-6 p-3 bg-gray-100 border border-gray-300 text-gray-800 rounded-md text-sm"
          >
            {{ errorMessage }}
          </div>
          <div
            v-if="successMessage"
            class="mt-6 p-3 bg-gray-100 border border-gray-300 text-gray-800 rounded-md text-sm"
          >
            {{ successMessage }}
          </div>
        </div>

        <div class="mt-8 text-center text-sm text-gray-500">
          Don't have an account?
          <router-link to="/signup" class="text-gray-700 hover:text-gray-900 underline">
            Sign up
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { logIn } from '../auth'
import { useAuthStore } from '../stores/authStore'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const authStore = useAuthStore()

const handleLogIn = async () => {
  if (email.value && password.value) {
    isLoading.value = true
    errorMessage.value = null
    successMessage.value = null

    try {
      await logIn(email.value, password.value)
      if (authStore.isLoggedIn) {
        successMessage.value = 'Logged in successfully!'
      }
    } catch (error) {
      errorMessage.value = 'Invalid credentials. Please try again.'
    } finally {
      isLoading.value = false
    }
  }
}
</script>
