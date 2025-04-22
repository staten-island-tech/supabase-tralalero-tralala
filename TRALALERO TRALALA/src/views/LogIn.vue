<template>
  <div class="m-4">
    <h2 class="font-bold text-2xl mb-2">Log In</h2>
    <h2 class="">Log In</h2>
    <div class="bg-gray-300 p-4 rounded-xl h-40">
      <form @submit.prevent="handleLogIn">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit" :disabled="isLoading">Log In</button>
      </form>

      <div v-if="errorMessage" style="color: red;">
        <p>{{ errorMessage }}</p>
      </div>
      <div v-if="successMessage" style="color: green;">
        <p>{{ successMessage }}</p>
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

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref<string>('')
const successMessage = ref<string>('')
const authStore = useAuthStore()

console.log('LogIn component loaded')

const handleLogIn = async () => {
  if (email.value && password.value) {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      await logIn(email.value, password.value)
      if (authStore.isLoggedIn) {
        successMessage.value = 'Logged in successfully!'
      }
    } catch (error) {
      errorMessage.value = 'Failed to log in. Please try again.'
    } finally {
      isLoading.value = false
    }
  }
}
</script>
