import type { TCardType, TChips, THomeCards, TSpinWheel } from './type';

export const Cards: Array<TCardType> = [
  {
    value: 1,
    url: new URL('@/assets/cards/front/card_a.png', import.meta.url).href,
    playerCount: 0,
    totalBet: 0,
  },
  {
    value: 2,
    url: new URL('@/assets/cards/front/card_2.png', import.meta.url).href,
    playerCount: 0,
    totalBet: 0,
  },
  {
    value: 3,
    url: new URL('@/assets/cards/front/card_3.png', import.meta.url).href,
    playerCount: 0,
    totalBet: 0,
  },
  {
    value: 4,
    url: new URL('@/assets/cards/front/card_4.png', import.meta.url).href,
    playerCount: 0,
    totalBet: 0,
  },
  {
    value: 5,
    url: new URL('@/assets/cards/front/card_5.png', import.meta.url).href,
    playerCount: 0,
    totalBet: 0,
  },
  {
    value: 6,
    url: new URL('@/assets/cards/front/card_6.png', import.meta.url).href,
    playerCount: 0,
    totalBet: 0,
  },
  {
    value: 7,
    url: new URL('@/assets/cards/front/card_7.png', import.meta.url).href,
    playerCount: 0,
    totalBet: 0,
  },
  {
    value: 8,
    url: new URL('@/assets/cards/front/card_8.png', import.meta.url).href,
    playerCount: 0,
    totalBet: 0,
  },
  {
    value: 9,
    url: new URL('@/assets/cards/front/card_9.png', import.meta.url).href,
    playerCount: 0,
    totalBet: 0,
  },
  {
    value: 10,
    url: new URL('@/assets/cards/front/card_10.png', import.meta.url).href,
    playerCount: 0,
    totalBet: 0,
  },
  {
    value: 0,
    url: new URL('@/assets/cards/front/card_0.png', import.meta.url).href,
    playerCount: 0,
    totalBet: 0,
  },
];

export const chips: Array<TChips> = [
  { value: 1, image: new URL('@/assets/coins/1PESO.png', import.meta.url).href },
  { value: 5, image: new URL('@/assets/coins/5PESO.png', import.meta.url).href },
  { value: 10, image: new URL('@/assets/coins/10PESO.png', import.meta.url).href },
  { value: 50, image: new URL('@/assets/coins/50PESO.png', import.meta.url).href },
  { value: 100, image: new URL('@/assets/coins/100PESO.png', import.meta.url).href },
  { value: 500, image: new URL('@/assets/coins/500PESO.png', import.meta.url).href },
  { value: 1000, image: new URL('@/assets/coins/1KPESO.png', import.meta.url).href },
  { value: 5000, image: new URL('@/assets/coins/5KPESO.png', import.meta.url).href },
  { value: 10000, image: new URL('@/assets/coins/10KPESO.png', import.meta.url).href },
];

export const wheelDeg: Array<TSpinWheel> = [
  { deg: 0, multiplier: 3, url: new URL('@/assets/game/spin-value/3x.png', import.meta.url).href },
  { deg: 45, multiplier: 4, url: new URL('@/assets/game/spin-value/4x.png', import.meta.url).href },
  { deg: 90, multiplier: 5, url: new URL('@/assets/game/spin-value/5x.png', import.meta.url).href },
  {
    deg: 135,
    multiplier: 6,
    url: new URL('@/assets/game/spin-value/6x.png', import.meta.url).href,
  },
  {
    deg: 180,
    multiplier: 7,
    url: new URL('@/assets/game/spin-value/7x.png', import.meta.url).href,
  },
  {
    deg: 225,
    multiplier: 8,
    url: new URL('@/assets/game/spin-value/8x.png', import.meta.url).href,
  },
  {
    deg: 270,
    multiplier: 9,
    url: new URL('@/assets/game/spin-value/9x.png', import.meta.url).href,
  },
  {
    deg: 315,
    multiplier: 1,
    url: new URL('@/assets/game/spin-value/bokya.png', import.meta.url).href,
  },
];

export const jackpotWheelDeg: Array<TSpinWheel> = [
  {
    deg: 0,
    multiplier: 10,
    url: new URL('@/assets/game/jackpot-spin-value/10X.png', import.meta.url).href,
  },
  {
    deg: 20,
    multiplier: 20,
    url: new URL('@/assets/game/jackpot-spin-value/20X.png', import.meta.url).href,
  },
  {
    deg: 30,
    multiplier: 30,
    url: new URL('@/assets/game/jackpot-spin-value/30X.png', import.meta.url).href,
  },
  {
    deg: 50,
    multiplier: 50,
    url: new URL('@/assets/game/jackpot-spin-value/50X.png', import.meta.url).href,
  },
  {
    deg: 100,
    multiplier: 100,
    url: new URL('@/assets/game/jackpot-spin-value/100X.png', import.meta.url).href,
  },
  {
    deg: 225,
    multiplier: 200,
    url: new URL('@/assets/game/jackpot-spin-value/200X.png', import.meta.url).href,
  },
  {
    deg: 270,
    multiplier: 500,
    url: new URL('@/assets/game/jackpot-spin-value/500X.png', import.meta.url).href,
  },
  {
    deg: 315,
    multiplier: 1,
    url: new URL('@/assets/game/jackpot-spin-value/JACKPOT.png', import.meta.url).href,
  },
];

export const botNames: Array<string> = [
  'Sophia',
  'Liam',
  'Olivia',
  'Noah',
  'Emma',
  'James',
  'Ava',
  'Elijah',
  'Isabella',
  'Lucas',
  'Mia',
  'Ethan',
  'Amelia',
  'Alexander',
  'Charlotte',
  'Benjamin',
  'Harper',
  'Henry',
  'Evelyn',
  'Sebastian',
];

export const probabilityRate = {
  aceCardRate: 0.1, // 10% chance of ace card appearing
  multipliersRate: 1, // 30% chance of multipliers appear on cards
  bokyaRate: 0.2, // 20% chance of bokya
  BonusRate: 0.4, // 20% chance of bonus
  JackpotRate: 0.01, // 0.01% chance of jackpot
};

export const HomeCards: Array<THomeCards> = [
  { value: 2, url: new URL('@/assets/cards/front/card_2.png', import.meta.url).href },
  { value: 3, url: new URL('@/assets/cards/front/card_3.png', import.meta.url).href },
  { value: 1, url: new URL('@/assets/cards/front/card_a.png', import.meta.url).href },
  { value: 4, url: new URL('@/assets/cards/front/card_4.png', import.meta.url).href },
  { value: 5, url: new URL('@/assets/cards/front/card_5.png', import.meta.url).href },
];

export const steps = [
  {
    target: '#jackpot-container',
    title: 'Community Jackpot',
    description:
      'This is the shared jackpot pool that grows with every round. A percentage of each rounds total bets contributes to this jackpot, increasing the potential rewards for players.',
  },
  {
    target: '#chip-amount',
    title: 'Credit Amount',
    description:
      'Your available credits for placing bets in the game. Make sure to manage them wisely to stay in the game!',
  },
  {
    target: '#leave-btn',
    title: 'Leave Button',
    description:
      'Click this button to exit the current game room. Ensure you’ve finalized any bets before leaving.',
  },
  {
    target: '#card-back',
    title: 'Card Deck',
    description:
      'This deck contains the shuffled cards used in the game. Each round, cards are drawn from this deck and distributed to players.',
  },
  {
    target: '#custom-card',
    title: 'Cards',
    description:
      'These are the four distributed cards that players can place bets on. Choose wisely and strategize based on the game flow!',
  },
  {
    target: '#player-count',
    title: 'Player Count',
    description:
      'Displays the number of players participating in this round. A higher count may mean greater competition and betting dynamics.',
  },
  {
    target: '#bet-count-container',
    title: 'Total Bet',
    description:
      'Shows the cumulative amount wagered on all cards during the current round. Keep an eye on this to understand betting trends!',
  },
  {
    target: '#bet-grid',
    title: 'Bet Amounts',
    description:
      'Various betting options are available here. Select the amount you wish to wager and place strategic bets on your chosen card.',
  },
];
