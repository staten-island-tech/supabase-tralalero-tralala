import { defineStore } from 'pinia';

interface AuthState {
  isLoggedIn: boolean;
  user: any | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    user: null,
  }),
  actions: {
    setLoggedIn(user: any) {
      this.isLoggedIn = true;
      this.user = user;
    },
    setLoggedOut() {
      this.isLoggedIn = false;
      this.user = null;
    },
  },
});