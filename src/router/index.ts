import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TransactionHistory from '@/views/TransactionHistoryView.vue'
import CashTransaction from '@/views/CashTransaction.vue'
import GameView from '@/views/GameView.vue'
import { usePlayerStore } from '@/stores'
import ReceiptView from '@/views/ReceiptView.vue'
import TermsOfService from '@/views/TermsOfService.vue'
import TestView from '@/views/TestView.vue'

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
      meta: { requiresAuth: true },
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
      meta: { requiresAuth: true },
    },
    {
      path: '/receipt/:id/:type',
      name: 'receipt',
      component: ReceiptView,
      meta: { requiresAuth: true },
    },
    {
      path: '/terms-of-service',
      name: 'terms-of-service',
      component: TermsOfService,
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
