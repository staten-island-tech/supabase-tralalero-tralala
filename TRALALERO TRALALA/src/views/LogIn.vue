<template>
  <div>
    <h2>Log In</h2>
    <form @submit.prevent="handleLogIn">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="isLoading">Log In</button>
    </form>

    <!-- Success or error messages -->
    <div v-if="errorMessage" style="color: red;">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-if="successMessage" style="color: green;">
      <p>{{ successMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { logIn } from '../auth'
import { useAuthStore } from '@/stores/authStore'

console.log('LogIn component loaded')

export default defineComponent({
  setup() {
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
          errorMessage.value = 'Failed to log in. Please try again.'
        } finally {
          isLoading.value = false
        }
      }
    }

    return { email, password, handleLogIn, isLoading, errorMessage, successMessage }
  },
})
</script>
