import { GameStatus, StartGameStatus } from '@/models/enums';
import type { TBots, TCardType, TGameHistory, TSelectedCard } from '@/models/type';
import { defineStore } from 'pinia';

type TState = {
  start_game: StartGameStatus;
  game_status: GameStatus;

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
    background_music: 100,
    card_music: 100,
    wheel_music: 100,
    win_music: 100,

    start_game: StartGameStatus.pending, // persist - DONE
    game_status: GameStatus.pending, // persist - DONE

    timer: 10, // persist - DONE
    startingIn: 5, // persist - DONE

    allBots: [], // persist - DONE
    selectedCards: [], // persist - DONE
    four_random_cards: [], // persist - DONE
    currentSelectedCard: null, // persist - DONE

    betOnAce: 0, // persist - DONE
    betOnCard: 0, // persist - DONE

    allBets: [],
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
    handleFetchLocalStorage() {
      // Timers
      const startingIn = JSON.parse(localStorage.getItem('startingIn') || '5');
      const timer = JSON.parse(localStorage.getItem('timer') || '10');
      this.startingIn = startingIn;
      this.timer = timer;

      // Enums Status
      const start_game = localStorage.getItem('start_game') as StartGameStatus;
      const game_status = localStorage.getItem('game_status') as GameStatus;
      this.start_game = start_game;
      this.game_status = game_status;

      // Arrays and Objects
      const allBots = JSON.parse(localStorage.getItem('allBots') || '[]');
      const selectedCards = JSON.parse(localStorage.getItem('selectedCards') || '{}');
      const four_random_cards = JSON.parse(localStorage.getItem('four_random_cards') || '[]');
      const currentSelectedCard = JSON.parse(localStorage.getItem('currentSelectedCard') || '{}');
      this.allBots = allBots;
      this.selectedCards = selectedCards;
      this.four_random_cards = four_random_cards;
      this.currentSelectedCard = currentSelectedCard;

      // Numbers State
      const betOnAce = JSON.parse(localStorage.getItem('betOnAce') || '0');
      const betOnCard = JSON.parse(localStorage.getItem('betOnCard') || '0');
      this.betOnAce = betOnAce;
      this.betOnCard = betOnCard;
    },

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

    setStartGame(newValue: StartGameStatus) {
      this.start_game = newValue;
      localStorage.setItem('start_game', this.start_game);
    },

    setGameStatus(newValue: GameStatus) {
      this.game_status = newValue;
      localStorage.setItem('game_status', this.game_status);
    },

    setFourCards(newValue: TCardType[]) {
      this.four_random_cards = newValue;
      localStorage.setItem('four_random_cards', JSON.stringify(this.four_random_cards));
    },

    setSelectedCards(newValue: TSelectedCard[]) {
      this.selectedCards = newValue;
      localStorage.setItem('selectedCards', JSON.stringify(this.selectedCards));
    },

    setCurrentSelectedCard(newValue: { index: number; card: TCardType } | null) {
      this.currentSelectedCard = newValue;
      localStorage.setItem('currentSelectedCard', JSON.stringify(this.currentSelectedCard));
    },

    setAllBets(newAllBets: string[]) {
      this.allBets = newAllBets;
    },

    setAllBots(newAllBots: TBots[]) {
      this.allBots = newAllBots;
      localStorage.setItem('allBots', JSON.stringify(this.allBots));
    },

    setStartingIn(newValue: number) {
      this.startingIn = newValue;
      localStorage.setItem('startingIn', String(this.startingIn));
    },

    decreaseStartingIn() {
      this.startingIn -= 1;
      localStorage.setItem('startingIn', String(this.startingIn));
    },

    setTimer(newValue: number) {
      this.timer = newValue;
      localStorage.setItem('timer', String(this.timer));
    },

    decreaseTimer() {
      this.timer -= 1;
      localStorage.setItem('timer', String(this.timer));
    },

    setBetOnAce(newValue: number) {
      this.betOnAce = newValue;
      localStorage.setItem('betOnAce', String(this.betOnAce));
    },

    setBetOnCard(newValue: number) {
      this.betOnCard = newValue;
      localStorage.setItem('betOnCard', String(this.betOnCard));
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
