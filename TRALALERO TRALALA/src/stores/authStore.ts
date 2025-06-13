import { defineStore } from 'pinia'

interface AuthState {
  isLoggedIn: boolean
  user: any | null
  id: any | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    user: null,
    id: null,
  }),
  actions: {
    setLoggedIn(id: any, user: any) {
      this.isLoggedIn = true
      this.user = user
      this.id = id
    },
    setLoggedOut() {
      this.isLoggedIn = false
      this.user = null
      this.id = null
    },
  },
  persist: true,
})
