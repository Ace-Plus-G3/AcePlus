import type { FormInstance } from 'element-plus'

export type TCardType = {
  value: number
  url: string
  playerCount: number
}

export type TSignupParams = {
  formE1: FormInstance | undefined
  handleChangeTab: (tab: 'Signup-Tab' | 'Login-Tab') => void
}

export type TLoginParams = {
  formE1: FormInstance | undefined
  handleCloseModal: () => void
}
