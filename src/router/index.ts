import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TransactionHistory from '@/views/TransactionHistoryView.vue'
import CashTransaction from '@/views/CashTransaction.vue'
import GameView from '@/views/GameView.vue'

import { usePlayerStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/transaction-history',
      name: 'transaction-history',
      component: TransactionHistory,
    },
    {
      path: '/cash-transaction',
      name: 'cash-transaction',
      component: CashTransaction,
      meta: { requiresAuth: true },
    },
    {
      path: '/game',
      name: 'game',
      component: GameView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !usePlayerStore().getToken) {
    next('/')
  } else {
    next()
  }
})

export default router
