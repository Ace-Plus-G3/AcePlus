import type { TUser } from '@/types/user'
import type { FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const usePlayerStore = defineStore('playerStore', () => {
  // * STATES
  const user = ref<TUser | null>(null)
  const token = ref<string | null>(null)

  // * GETTERS
  const getUser = computed(() => user.value)
  const getToken = computed(() => token.value)

  // * SETTERS
  const setUser = (newUser: TUser | null) => {
    user.value = newUser
  }
  const setToken = (newToken: string | null) => {
    token.value = newToken
  }

  // * ACTIONS
  const handleLogin = async (formE1: FormInstance | undefined) => {
    if (!formE1) return
  }
  const handleSignup = async (formE1: FormInstance | undefined) => {
    if (!formE1) return
  }

  return {
    // states
    user,
    token,

    // getters
    getUser,
    getToken,

    // setters
    setUser,
    setToken,

    // actions
    handleLogin,
    handleSignup,
  }
})
