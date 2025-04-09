<template>
  <div>
    <h2>Log In</h2>
    <form @submit.prevent="handleLogIn">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { logIn } from '../auth'

export default defineComponent({
  setup() {
    const email = ref('')
    const password = ref('')

    const handleLogIn = () => {
      if (email.value && password.value) {
        logIn(email.value, password.value)
      }
    }

    return { email, password, handleLogIn }
  },
})
</script>
