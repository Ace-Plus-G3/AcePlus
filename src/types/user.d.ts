export type TUser = {
  user_id: string
  phoneNumber: string
  password: string

  total_money: number
  transaction_history: Transaction[]
  created_at: string
  updated_at: string
}

export type Transaction = {
  transaction_id: string
  account_number: number
  user_id: string
  type: 'Cash- In' | 'Cash- Out'
  amount: number
  date: string
}

export type Cashin = Omit<Transaction, 'type'> & {
  type: 'Cash- In'
}

export type Cashout = Omit<Transaction, 'type'> & {
  type: 'Cash- Out'
}
