import type { Cashin } from '@/types/user'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usePlayerStore } from './playerStore'

export const useCreditStore = defineStore('creditStore', () => {
  // STATES
  const cashin = ref<Cashin[]>([])
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
    currentBalance.value = newBalance
    localStorage.setItem('currentBalance', JSON.stringify(currentBalance.value))
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

  
  const loadPersistedData = () => {
    const playerStore = usePlayerStore()
    const loggedInUser = playerStore.getUser

    if (!loggedInUser) {
      console.error('No user is logged in!')
      return
    }

    const userId = loggedInUser.user_id

    const loadFromLocalStorage = (key: string, defaultValue: [] | number) => {
      const savedData = localStorage.getItem(key)
      return savedData ? JSON.parse(savedData) : defaultValue
    }

    // Load user-specific data
    cashin.value = loadFromLocalStorage(`cashin_${userId}`, [])
    currentBalance.value = loadFromLocalStorage(`currentBalance_${userId}`, 0)
  }



  return {
    cashin,
    currentBalance,

    setCashin,
    setCurrentBalance,

    getCashin,
    getCurrentBalance,

    handleCashin,
    loadPersistedData,
  }
})
