import type { Cashin, Cashout } from '@/types/user'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usePlayerStore } from './playerStore'
import { loadFromLocalStorage } from '@/utils/loadFromLocalStorage'

export const useCreditStore = defineStore('creditStore', () => {
  // STATES
  const cashin = ref<Cashin[]>([]) // all cash-in history
  const cashout = ref<Cashout[]>([]) // all cash-out history
  const currentBalance = ref<number>(0)

  //GETTERS
  const getCashin = computed(() => cashin.value)
  const getCurrentBalance = computed(() => currentBalance.value)

  //SETTERS
  const setCashin = (newCashin: Cashin[]) => {
    cashin.value = newCashin
    localStorage.setItem('cashin', JSON.stringify(cashin.value))
  }
  const setCurrentBalance = (newBalance: number) => {
    const playerStore = usePlayerStore()
    const loggedInUser = playerStore.getUser

    if (!loggedInUser) {
      console.error('No user is logged in!')
      return
    }

    const userId = loggedInUser.user_id
    currentBalance.value = newBalance
    localStorage.setItem(`currentBalance_${userId}`, JSON.stringify(currentBalance.value))
  }

  //ACTIONS
  const handleCashin = (amount: number, account_number: number) => {
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
    cashin.value = userCashin
    localStorage.setItem(userCashinKey, JSON.stringify(userCashin))

    // Update and save the user's current balance
    const savedBalance = localStorage.getItem(userBalanceKey)
    const userBalance = savedBalance ? Number(savedBalance) : 0
    currentBalance.value = userBalance + Number(amount)
    localStorage.setItem(userBalanceKey, JSON.stringify(currentBalance.value))
  }

  const handleCashout = (amount: number, account_number: number) => {
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
    cashout.value = userCashout
    localStorage.setItem(userCashoutKey, JSON.stringify(userCashout))

    // Update and save the user's current balance
    const savedBalance = localStorage.getItem(userBalanceKey)
    const userBalance = savedBalance ? Number(savedBalance) : 0

    currentBalance.value = userBalance - Number(amount)
    localStorage.setItem(userBalanceKey, JSON.stringify(currentBalance.value))
  }

  const handlePersistCredits = () => {
    const playerStore = usePlayerStore()
    const loggedInUser = playerStore.getUser

    if (!loggedInUser) {
      console.error('No user is logged in!')
      return
    }

    const userId = loggedInUser.user_id

    // Load user-specific data
    cashin.value = loadFromLocalStorage(`cashin_${userId}`, [])
    cashout.value = loadFromLocalStorage(`cashout_${userId}`, [])
    currentBalance.value = loadFromLocalStorage(`currentBalance_${userId}`, 0)
    console.log('Persist Credits!')
  }

  return {
    cashin,
    currentBalance,
    cashout,

    setCashin,
    setCurrentBalance,

    getCashin,
    getCurrentBalance,

    handleCashin,
    handleCashout,
    handlePersistCredits,
  }
})
