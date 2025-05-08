import type { FormInstance } from 'element-plus';

export type TLogin = {
  phoneNumber: string;
  password: string;
};

export type TSignup = {
  phoneNumber: string;
  password: string;
};

export type TUser = {
  user_id: string;
  phoneNumber: string;
  password: string;

  total_money: number;
  transaction_history: Transaction[];
  created_at: string;
  updated_at: string;
  isNewUser?: boolean;
};

export type Transaction = {
  transaction_id: string;
  account_number: number;
  user_id: string;
  type: 'cash-in' | 'cash-out';
  amount: number;
  date: string;
};

export type Cashin = Omit<Transaction, 'type'> & {
  type: 'cash-in';
};

export type Cashout = Omit<Transaction, 'type'> & {
  type: 'cash-out';
};

export type TCardType = {
  value: number;
  url: string;
  playerCount: number;
  randomMultiplier?: number;
  totalBet: number;
};

export type TSelectedCard = {
  value: number;
  url: string;
  playerCount: number;
  betAmount: number; // player's bet
  randomMultiplier?: number;
  totalBet: number;
};

export type TChips = {
  value: number;
  image: string;
};

export type TSignupParams = {
  formE1: FormInstance | undefined;
  handleChangeTab: (tab: 'Signup-Tab' | 'Login-Tab') => void;
};

export type TLoginParams = {
  formE1: FormInstance | undefined;
  handleCloseModal: () => void;
};

export type TSpinWheel = {
  deg: number;
  multiplier: number;
  url: string;
};

export type TBots = {
  bot_name: string;
  bot_cards: TBotsCards[];
};

export type TBotsCards = {
  card_index: number;
  bot_bet_amount: number;
};

export type THomeCards = {
  value: number;
  url: string;
};

export type TGameHistory = {
  betValue: number;
  amount: number;
  type: 'WIN' | 'LOSE';
  date: Date;
};
