import type { TBots, TCardType, TSelectedCard } from '@/models/type'
import { defineStore } from 'pinia'
// import FlipCardSFX from '@/assets/audio/sample1_card_flip.mp3'

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    start_game: 'PENDING' as 'PENDING' | 'START' | 'DONE',
    game_status: 'PENDING' as 'PENDING' | 'WIN' | 'LOSE',

    four_random_cards: [] as TCardType[],
    selectedCards: [] as TSelectedCard[],
    currentSelectedCard: null as { index: number; card: TCardType } | null,

    allBets: [] as string[],
    allBots: [] as TBots[],

    startingIn: 5 as number,
    timer: 10 as number,
    betOnAce: 0 as number,

    showSpinTheWheel: false as boolean,
    showBetDrawer: false as boolean,
    revealCards: false as boolean,
    accumulatedJackpot: 0 as number,

    totalPlayers: 0 as number,

    // cardFlipSound: new Audio(FlipCardSFX),
  }),
  getters: {
    getStartGame: (state) => state.start_game,
    getGameStatus: (state) => state.game_status,

    getFourCards: (state) => state.four_random_cards,
    getSelectedCards: (state) => state.selectedCards,
    getCurrentSelectedCard: (state) => state.currentSelectedCard,

    getAllBets: (state) => state.allBets,
    getAllBots: (state) => state.allBots,

    getStartinIn: (state) => state.startingIn,
    getTimer: (state) => state.timer,
    getBetOnAce: (state) => state.betOnAce,

    getSpinTheWheel: (state) => state.showSpinTheWheel,
    getIsRevealCards: (state) => state.revealCards,
    getShowBetDrawer: (state) => state.showBetDrawer,
    getAccumulatedJackpot: (state) => state.accumulatedJackpot,

    getTotalPlayers: (state) => state.totalPlayers,
  },
  actions: {
    setStartGame(newValue: 'PENDING' | 'START' | 'DONE') {
      this.start_game = newValue
    },

    setGameStatus(newValue: 'PENDING' | 'WIN' | 'LOSE') {
      this.game_status = newValue
    },

    setFourCards(newValue: TCardType[]) {
      this.four_random_cards = newValue
    },

    setSelectedCards(newValue: TSelectedCard[]) {
      this.selectedCards = newValue
    },

    setCurrentSelectedCard(newValue: { index: number; card: TCardType } | null) {
      this.currentSelectedCard = newValue
    },

    setAllBets(newAllBets: string[]) {
      this.allBets = newAllBets
    },

    setAllBots(newAllBots: TBots[]) {
      this.allBots = newAllBots
    },

    setStartingIn(newValue: number) {
      this.startingIn = newValue
    },

    decreaseStartingIn() {
      this.startingIn -= 1
    },

    setTimer(newValue: number) {
      this.timer = newValue
    },

    decreaseTimer() {
      this.timer -= 1
    },

    setBetOnAce(newValue: number) {
      this.betOnAce = newValue
    },

    setShowSpinTheWheel(newValue: boolean) {
      this.showSpinTheWheel = newValue
    },

    setDrawer(newValue: boolean) {
      this.showBetDrawer = newValue
    },

    setRevealCard(newValue: boolean) {
      this.revealCards = newValue
    },

    setAccumulatedJackpot(newBalance: number) {
      this.accumulatedJackpot = newBalance
    },

    setTotalPlayers(newValue: number) {
      this.totalPlayers = newValue
    },
  },
})
