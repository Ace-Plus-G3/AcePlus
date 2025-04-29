import { defineStore } from 'pinia'
import { usePlayerStore } from './playerStore'
import { loadFromLocalStorage } from '@/utils/loadFromLocalStorage'
import type { Cashin, Cashout } from '@/models/type'

export const useCreditStore = defineStore('creditStore', {
  state: () => ({
    cashin: [] as Cashin[],
    cashout: [] as Cashout[],
    currentBalance: 0 as number,
  }),
  getters: {
    getCashin: (state) => state.cashin,
    getCashout: (state) => state.cashout,
    getCurrentBalance: (state) => state.currentBalance,
  },
  actions: {
    setCashin(newCashin: Cashin[]) {
      this.cashin = newCashin
      localStorage.setItem('cashin', JSON.stringify(this.cashin))
    },
    setCashout(newCashout: Cashout[]) {
      this.cashout = newCashout
      localStorage.setItem('cashout', JSON.stringify(this.cashout))
    },
    setCurrentBalance(newBalance: number) {
      const loggedInUser = usePlayerStore().getUser

      if (!loggedInUser) {
        console.error('No user is logged in!')
        return
      }

      const userId = loggedInUser.user_id
      this.currentBalance = newBalance
      localStorage.setItem(`currentBalance_${userId}`, JSON.stringify(this.getCurrentBalance))
    },
    handleCashin(amount: number, account_number: number) {
      const playerStore = usePlayerStore()
      const loggedInUser = playerStore.getUser

      if (!loggedInUser) {
        console.error('No user is logged in!')
        return
      }

      const userId = loggedInUser.user_id

      const newCashin: Cashin = {
        transaction_id: crypto.randomUUID(),
        user_id: userId, // Use the logged-in user's ID
        type: 'Cash- In',
        amount,
        date: new Date().toISOString(),
        account_number,
      }
      // Load the user's cashin history from local storage
      const userCashinKey = `cashin_${userId}`
      const userBalanceKey = `currentBalance_${userId}`

      const savedCashin = localStorage.getItem(userCashinKey)
      const userCashin = savedCashin ? JSON.parse(savedCashin) : []
      userCashin.push(newCashin)

      // Save the updated cashin history back to local storage
      this.setCashin(userCashin)
      localStorage.setItem(userCashinKey, JSON.stringify(userCashin))

      // Update and save the user's current balance
      const savedBalance = localStorage.getItem(userBalanceKey)
      const userBalance = savedBalance ? Number(savedBalance) : 0
      this.setCurrentBalance(userBalance + Number(amount))
      localStorage.setItem(userBalanceKey, JSON.stringify(this.getCurrentBalance))
    },
    handleCashout(amount: number, account_number: number) {
      const playerStore = usePlayerStore()
      const loggedInUser = playerStore.getUser

      if (!loggedInUser) {
        console.error('No user is logged in!')
        return
      }

      const userId = loggedInUser.user_id

      const newCashout: Cashout = {
        transaction_id: crypto.randomUUID(),
        user_id: userId, // Use the logged-in user's ID
        type: 'Cash- Out',
        amount,
        date: new Date().toISOString(),
        account_number,
      }

      // Load the user's cashout history from local storage
      const userCashoutKey = `cashout_${userId}`
      const userBalanceKey = `currentBalance_${userId}`

      const savedCashout = localStorage.getItem(userCashoutKey)
      const userCashout = savedCashout ? JSON.parse(savedCashout) : []
      userCashout.push(newCashout)

      // Save the updated cashin history back to local storage
      this.setCashout(userCashout)
      localStorage.setItem(userCashoutKey, JSON.stringify(userCashout))

      // Update and save the user's current balance
      const savedBalance = localStorage.getItem(userBalanceKey)
      const userBalance = savedBalance ? Number(savedBalance) : 0

      this.setCurrentBalance(userBalance - Number(amount))
      localStorage.setItem(userBalanceKey, JSON.stringify(this.getCurrentBalance))
    },
    handlePersistCredits() {
      const playerStore = usePlayerStore()
      const loggedInUser = playerStore.getUser

      if (!loggedInUser) {
        console.error('No user is logged in!')
        return
      }

      const userId = loggedInUser.user_id

      // Load user-specific data
      this.setCashin(loadFromLocalStorage(`cashin_${userId}`, []))
      this.setCashout(loadFromLocalStorage(`cashout_${userId}`, []))
      this.setCurrentBalance(loadFromLocalStorage(`currentBalance_${userId}`, 0))
      console.log('Persist Credits!')
    },
    getCashinTransacById(transaction_id: string | string[]) {
      return this.getCashin.find((item) => item.transaction_id === transaction_id)
    },
    getCashoutTransacById(transaction_id: string | string[]) {
      return this.cashout.find((item) => item.transaction_id === transaction_id)
    },
  },
})
