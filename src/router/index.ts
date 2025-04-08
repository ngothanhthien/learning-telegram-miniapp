import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SwapStar from '../views/SwapStar.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/swapstar',
    name: 'SwapStar',
    component: SwapStar,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
