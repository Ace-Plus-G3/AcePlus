import type { TBots, TCardType, TGameHistory, TSelectedCard } from '@/models/type';
import { defineStore } from 'pinia';

type TState = {
  start_game: 'PENDING' | 'START' | 'DONE';
  game_status: 'PENDING' | 'WIN' | 'LOSE';

  background_music: number;
  card_music: number;
  wheel_music: number;
  win_music: number;

  four_random_cards: TCardType[];
  selectedCards: TSelectedCard[];
  currentSelectedCard: {
    index: number;
    card: TCardType;
  } | null;

  allBets: string[];
  allBots: TBots[];

  timer: number;
  betOnAce: number;
  betOnCard: number;
  startingIn: number;
  totalPlayers: number;
  accumulatedJackpot: number;

  revealCards: boolean;
  showBetDrawer: boolean;
  showSpinTheWheel: boolean;
  showJackpotSpinTheWheel: boolean;
  showWinBanner: boolean;
  showHistoryDrawer: boolean;
  gameHistory: TGameHistory[];
};

export const useGameStore = defineStore('gameStore', {
  state: (): TState => ({
    start_game: 'PENDING',
    game_status: 'PENDING',

    background_music: 100,
    card_music: 100,
    wheel_music: 100,
    win_music: 100,

    selectedCards: [],
    four_random_cards: [],
    currentSelectedCard: null,

    allBets: [],
    allBots: [],

    timer: 10,
    betOnAce: 0,
    betOnCard: 0,
    startingIn: 5,
    totalPlayers: 0,
    accumulatedJackpot: 0,

    revealCards: false,
    showBetDrawer: false,
    showSpinTheWheel: false,
    showJackpotSpinTheWheel: false,
    showWinBanner: false,
    showHistoryDrawer: false,

    gameHistory: [],
  }),
  getters: {
    getBackgroundMusic: (state) => state.background_music,
    getCardMusic: (state) => state.card_music,
    getMusicWheel: (state) => state.wheel_music,
    getWinMusic: (state) => state.win_music,

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
    getBetOnCard: (state) => state.betOnCard,

    getSpinTheWheel: (state) => state.showSpinTheWheel,
    getJackpotSpinTheWheel: (state) => state.showJackpotSpinTheWheel,
    getIsRevealCards: (state) => state.revealCards,
    getShowBetDrawer: (state) => state.showBetDrawer,
    getAccumulatedJackpot: (state) => state.accumulatedJackpot,

    getTotalPlayers: (state) => state.totalPlayers,
    getShowWinBanner: (state) => state.showWinBanner,

    getGameHistory: (state) => state.gameHistory,
    getShowHistoryDrawer: (state) => state.showHistoryDrawer,
  },
  actions: {
    setBackgroundMusic(newValue: number) {
      this.background_music = newValue;
    },

    setCardMusic(newValue: number) {
      this.card_music = newValue;
    },

    setWheelMusic(newValue: number) {
      this.wheel_music = newValue;
    },

    setWinMusic(newValue: number) {
      this.win_music = newValue;
    },

    setStartGame(newValue: 'PENDING' | 'START' | 'DONE') {
      this.start_game = newValue;
    },

    setGameStatus(newValue: 'PENDING' | 'WIN' | 'LOSE') {
      this.game_status = newValue;
    },

    setFourCards(newValue: TCardType[]) {
      this.four_random_cards = newValue;
    },

    setSelectedCards(newValue: TSelectedCard[]) {
      this.selectedCards = newValue;
    },

    setCurrentSelectedCard(newValue: { index: number; card: TCardType } | null) {
      this.currentSelectedCard = newValue;
    },

    setAllBets(newAllBets: string[]) {
      this.allBets = newAllBets;
    },

    setAllBots(newAllBots: TBots[]) {
      this.allBots = newAllBots;
    },

    setStartingIn(newValue: number) {
      this.startingIn = newValue;
    },

    decreaseStartingIn() {
      this.startingIn -= 1;
    },

    setTimer(newValue: number) {
      this.timer = newValue;
    },

    decreaseTimer() {
      this.timer -= 1;
    },

    setBetOnAce(newValue: number) {
      this.betOnAce = newValue;
    },

    setBetOnCard(newValue: number) {
      this.betOnCard = newValue;
    },

    setShowSpinTheWheel(newValue: boolean) {
      this.showSpinTheWheel = newValue;
    },

    setShowJackpotSpinTheWheel(newValue: boolean) {
      this.showJackpotSpinTheWheel = newValue;
    },

    setDrawer(newValue: boolean) {
      this.showBetDrawer = newValue;
    },

    setRevealCard(newValue: boolean) {
      this.revealCards = newValue;
    },

    setAccumulatedJackpot(newBalance: number) {
      this.accumulatedJackpot = newBalance;
    },

    setTotalPlayers(newValue: number) {
      this.totalPlayers = newValue;
    },

    setWinBanner(newValue: boolean) {
      this.showWinBanner = newValue;
    },

    setGameHistory(newValue: TGameHistory) {
      this.gameHistory = [newValue, ...this.gameHistory];
    },

    setShowGameHistoryDrawer(newValue: boolean) {
      this.showHistoryDrawer = newValue;
    },
  },
});
