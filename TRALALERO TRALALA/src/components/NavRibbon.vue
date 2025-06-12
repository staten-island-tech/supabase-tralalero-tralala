<template>
  <div class="bg-base-200 m-auto">
    <nav class="m-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 py-2">
      <router-link
        to="/"
        class="text-2xl font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200"
      >
        <img src="/images/newhomebutton.png" alt="homeicon" class="h-10 w-10 object-cover" />
      </router-link>
      <div class="text-xl">Italy's Finance</div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-4">
          <div class="relative" v-if="auth.isLoggedIn">
            <button
              @click="toggleDropdown"
              class="flex items-center focus:outline-none"
              aria-label="Profile menu"
              aria-haspopup="true"
              :aria-expanded="isOpen"
            >
              <img
                src="/images/profilepic.png"
                alt="Profile"
                class="h-10 w-10 rounded-full border border-gray-300 object-cover hover:opacity-80 transition-opacity duration-200"
              />
              <svg
                class="ml-1 h-4 w-4 text-gray-600 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-show="isOpen"
                class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-base-300 shadow-lg ring-1 ring-base-200 ring-opacity-5 border-1 border-base-100 focus:outline-none z-50"
              >
                <div class="py-1" role="none">
                  <router-link
                    :to="`/profile/${auth.id}`"
                    class="block px-4 py-2 text-sm hover:bg-neutral rounded-sm"
                    role="menuitem"
                  >
                    Your Profile
                  </router-link>
                  <router-link
                    to="/"
                    @click="handleLogout"
                    class="block w-full px-4 py-2 text-left bg-base-300 text-sm hover:bg-neutral rounded-sm"
                    role="menuitem"
                  >
                    Sign out
                  </router-link>
                </div>
              </div>
            </transition>
          </div>
          <div v-else class="flex space-x-4">
            <button
              @click="router.push({ path: '/signup', replace: true })"
              class="px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              Sign Up
            </button>
            <button
              @click="router.push({ path: '/login', replace: true })"
              class="px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/supabase'
import { useAuthStore } from '../stores/authStore'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { parseConfigFileTextToJson } from 'typescript'

const router = useRouter()

const auth = useAuthStore()

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = () => {
  auth.setLoggedOut()
  isOpen.value = false
}

const totalBalance = ref<number>(0)
const fetchTotalBalance = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', auth.id)
    .single()

  if (error) {
    console.error('Error fetching balance:', error)
  } else {
    totalBalance.value = data.balance
  }
}

fetchTotalBalance()

onMounted(() => {
  fetchTotalBalance()
})
</script>
