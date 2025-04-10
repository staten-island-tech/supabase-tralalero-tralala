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

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { signUp } from '../auth'

console.log('SignUp component loaded')

export default defineComponent({
  setup() {
    const email = ref('')
    const password = ref('')

    const handleSignUp = () => {
      if (email.value && password.value) {
        signUp(email.value, password.value)
      }
    }

    return { email, password, handleSignUp }
  },
})
</script>
