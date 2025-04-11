<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignUp">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signUp } from '../auth'

const email = ref('')
const password = ref('')

console.log('SignUp component loaded')

const handleSignUp = () => {
  if (email.value && password.value) {
    signUp(email.value, password.value)
  }
}
</script>