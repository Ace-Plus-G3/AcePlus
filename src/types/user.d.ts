export type TUser = {
  user_id: string
  username: string
  email: string
  password: string

  total_money: number
  transaction_history: Transaction[]
  created_at: string
  updated_at: string
}

export type Transaction = {
  transaction_id: string
  user_id: string
  type: 'top_up' | 'withdrawal'
  amount: number
  date: string
}
