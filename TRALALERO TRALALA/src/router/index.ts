import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignUp.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/MyProfile.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LogIn.vue'),
    }
  ],
})

export default router


