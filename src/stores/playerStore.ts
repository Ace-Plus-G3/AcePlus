import type { TUser } from '@/types/user'
import type { FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export const usePlayerStore = defineStore('playerStore', () => {
  // * STATES
  const router = useRouter()
  const user = ref<TUser | null>(null)
  const token = ref<string | null>(null)
  const players = ref<TUser[]>([])

  // * GETTERS
  const getUser = computed(() => user.value)
  const getPlayers = computed(() => players.value)
  const getToken = computed(() => token.value)

  // * SETTERS
  const setUser = (newUser: TUser | null) => {
    user.value = newUser
  }
  const setPlayers = (newPlayers: TUser[]) => {
    players.value = newPlayers
  }
  const setToken = (newToken: string | null) => {
    token.value = newToken
  }

  // * ACTIONS
  const handleSignup = async (formE1: FormInstance | undefined) => {
    if (!formE1) return
  }
  const handleLogin = async (formE1: FormInstance | undefined) => {
    if (!formE1) return
    await formE1.validate((valid, fields) => {
      if (valid) {
        const formData = formE1.$props.model
        if (!formData) return

        const players = localStorage.getItem('players')
        // If there's no players[] in local storage, send error
        if (!players) return console.log('Players not found!')

        // Find player trying to log in  via username
        const foundPlayer: TUser = JSON.parse(players).find(
          (item: TUser) => item.username === formData.username,
        )

        // If player not  found, send error
        if (!foundPlayer) return console.log('Player not found!')

        // If player found, save the user info and token to pinia
        usePlayerStore().setToken(foundPlayer.user_id)
        usePlayerStore().setUser({
          user_id: foundPlayer.user_id,
          username: foundPlayer.username,
          email: foundPlayer.email,
          password: foundPlayer.password,
          total_money: foundPlayer.total_money,
          transaction_history: foundPlayer.transaction_history,
          created_at: foundPlayer.created_at,
          updated_at: foundPlayer.updated_at,
        })

        // Saves the user info and token to local storage
        localStorage.setItem('token', JSON.stringify(foundPlayer.user_id))
        localStorage.setItem(
          'user',
          JSON.stringify({
            user_id: foundPlayer.user_id,
            username: foundPlayer.username,
            email: foundPlayer.email,
            password: foundPlayer.password,
            total_money: foundPlayer.total_money,
            transaction_history: foundPlayer.transaction_history,
            created_at: foundPlayer.created_at,
            updated_at: foundPlayer.updated_at,
          }),
        )
        router.push('/')
        console.log('Logged in successfully!')
      } else {
        console.log('error submit!', fields)
      }
    })
  }
  const handleLogout = () => {
    setUser(null)
    setToken(null)
  }

  return {
    // states
    user,
    token,

    // getters
    getUser,
    getPlayers,
    getToken,

    // setters
    setUser,
    setToken,
    setPlayers,

    // actions
    handleLogin,
    handleSignup,
    handleLogout,
  }
})
