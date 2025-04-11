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
    await formE1.validate((valid, fields) => {
      if (valid) {
        const formData = {
          user_id: String(Math.random() * 10),
          username: formE1.$props.model?.username,
          email: formE1.$props.model?.email,
          password: formE1.$props.model?.password,
          total_money: formE1.$props.model?.total_money,
          transaction_history: formE1.$props.model?.transaction_history,
          created_at: new Date(),
          updated_at: new Date(),
        }

        if (!formData) return

        // Get all saves players in local storage
        const players_in_localstorage = localStorage.getItem('players')

        // If there's no players, create one
        if (!players_in_localstorage) {
          const updatedPlayers = JSON.stringify([formData])
          localStorage.setItem('players', updatedPlayers)
          console.log('Account created successfully!')
          router.push('/login')
          return
        }

        // If player already exists, return error
        const foundPlayer = JSON.parse(players_in_localstorage).find(
          (item: TUser) => item.username === formData.username,
        )

        if (foundPlayer) {
          return console.log('User already exists!')
        }

        // If new player and doesn't exists in local storage, add the new player
        const updatedPlayers = JSON.stringify([...JSON.parse(players_in_localstorage), formData])
        localStorage.setItem('players', updatedPlayers)
        console.log('Account created successfully!')
        router.push('/login')
      } else {
        console.log('error submit!', fields)
      }
    })
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
