<template>
  <div class="bg-base-100 flex flex-col items-center justify-center p-4">
    <div
      class="w-full min-h-[480px] max-w-md border border-base-300 rounded-lg shadow-sm py-10 px-8 bg-base-200"
    >
      <div class="flex flex-col h-full justify-between">
        <div>
          <h2 class="text-3xl font-medium text-center mb-3">Italy's Finest</h2>
          <h2 class="text-2xl font-normal mb-8 text-base-content text-center">Log In</h2>

          <form @submit.prevent="handleLogIn" class="space-y-5">
            <div>
              <input
                v-model="email"
                type="email"
                placeholder="Email"
                required
                class="w-full px-4 py-3 border border-base-300 rounded-md focus:outline-none focus:ring-1 focus:ring-base-300 focus:border-base-300 bg-base-100 focus:bg-[#373B4B] transition duration-100"
              />
            </div>

            <div>
              <input
                v-model="password"
                type="password"
                placeholder="Password"
                required
                class="w-full px-4 py-3 border border-base-300 rounded-md focus:outline-none focus:ring-1 focus:ring-base-300 focus:border-base-300 bg-base-100 focus:bg-[#373B4B] transition duration-100"
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
            class="mt-6 p-3 bg-[#ff4a4a] border border-red-300 text-neutral-content rounded-md text-sm font-semibold"
          >
            {{ errorMessage }}
          </div>
        </div>

        <div class="mt-8 text-center text-sm text-base-content">
          Don't have an account?
          <router-link to="/signup" class="text-base-content hover:text-neutral-content underline">
            Sign up
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { logIn } from '../auth'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref<string>()
const auth = useAuthStore()

onMounted(() => {
  if (auth.isLoggedIn) {
    router.push({ path: '/profile', replace: true })
  }
})

const handleLogIn = async () => {
  if (email.value && password.value) {
    isLoading.value = true
    errorMessage.value = ''

    try {
      await logIn({ email: email.value, password: password.value })
      router.push({ path: '/profile', replace: true })
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = `Login failed. ${error.message}`
      } else {
        errorMessage.value = 'Login failed due to an unknown error.'
      }
    } finally {
      isLoading.value = false
    }
  }
}
</script>
