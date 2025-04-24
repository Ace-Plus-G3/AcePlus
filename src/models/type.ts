import type { FormInstance } from 'element-plus'

export type TCardType = {
  value: number
  url: string
  playerCount: number
  randomMultiplier?: number
}

export type TSelectedCard = {
  value: number
  url: string
  playerCount: number
  betAmount: number
  randomMultiplier?: number
}

export type TChips = {
  value: number
  image: string
}

export type TSignupParams = {
  formE1: FormInstance | undefined
  handleChangeTab: (tab: 'Signup-Tab' | 'Login-Tab') => void
}

export type TLoginParams = {
  formE1: FormInstance | undefined
  handleCloseModal: () => void
}

export type TSpinWheel = {
  deg: number
  multiplier: number
  url: string
}

export type TBots = {
  bot_name: string
  bot_cards: TBotsCards[]
}

export type TBotsCards = {
  card_index: number
  bot_bet_amount: number
}
