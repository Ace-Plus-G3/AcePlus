import { Cards } from '@/models/constants'
import type { TBots, TCardType, TSelectedCard } from '@/models/type'
import { getRandomCards } from '@/utils/getRandomCards'
import { defineStore } from 'pinia'
import { formatCurrency } from '@/utils/convertMoney'
import { useCreditStore } from './creditStore'
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

    // cardFlipSound: new Audio(FlipCardSFX),
  }),
  getters: {
    getStartGame: (state) => state.start_game,
    getGameStatus: (state) => state.game_status,

    getFourCards: (state) => state.four_random_cards,
    getSelectedCards: (state) => state.selectedCards,

    getAllBets: (state) => state.allBets,
    getAllBots: (state) => state.allBots,

    getStartinIn: (state) => state.startingIn,
    getTimer: (state) => state.timer,
    getBetOnAce: (state) => state.betOnAce,

    getSpinTheWheel: (state) => state.showSpinTheWheel,
    getIsRevealCards: (state) => state.revealCards,
    getShowBetDrawer: (state) => state.showBetDrawer,
    getAccumulatedJackpot: (state) => state.accumulatedJackpot,
  },
  actions: {
    decreaseTimer() {
      this.timer--
    },

    decreaseStartingIn() {
      this.startingIn--
    },

    setStartingIn(newValue: number) {
      this.startingIn = newValue
    },

    setTimer(newValue: number) {
      this.timer = newValue
    },

    setDrawer(newValue: boolean) {
      this.showBetDrawer = newValue
    },

    handleCancelBet() {
      this.showBetDrawer = false
      this.currentSelectedCard = null
    },

    initializeGame() {
      let intervalId: number | undefined = undefined

      this.four_random_cards = getRandomCards(Cards)
      this.start_game = 'PENDING'

      if (intervalId !== undefined) {
        clearInterval(intervalId)
      }

      intervalId = setInterval(() => {
        if (this.startingIn > 0) {
          this.startingIn--
        } else {
          clearInterval(intervalId)
          intervalId = undefined

          setTimeout(() => {
            this.start_game = 'START'
          }, 200)
        }
      }, 1000)
    },

    getHighestCard() {
      if (this.four_random_cards.length) return null

      const highestCard = this.four_random_cards.reduce((max, curr) => {
        return curr > max ? curr : max
      })

      setTimeout(() => {
        const hasLuckyCard = this.selectedCards.some((card: TCardType) => card.value === 1)

        if (hasLuckyCard) {
          this.game_status = 'WIN'
        }

        const hasHighestCard = this.selectedCards.some(
          (card: TCardType) => card.value === highestCard.value,
        )

        if (hasHighestCard) {
          this.game_status = 'WIN'
        } else {
          this.game_status = 'LOSE'
        }
      }, 500)

      return highestCard
    },

    handleRevealCard() {
      this.revealCards = true
      // this.cardFlipSound.loop = false
      // this.cardFlipSound.play()

      if (this.four_random_cards.length === 0) return null

      const highestCard = this.four_random_cards.reduce((max, curr) => {
        return curr > max ? curr : max
      })
      const hasLuckyCard = this.selectedCards.findIndex((card: TCardType) => card.value === 1)

      this.selectedCards.forEach((item) => {
        if (hasLuckyCard >= 0) {
          if (item.value === highestCard.value && hasLuckyCard >= 0) {
            // Skip processing the highest card if the lucky card also exists
            console.log('SKIP SINCE the item is not the highest card and there is a lucky card')
            return
          }

          // If the item is the lucky card, spin the wheel
          if (item.value === this.selectedCards[hasLuckyCard].value) {
            setTimeout(() => {
              const withMultiplier =
                item.betAmount * (item.randomMultiplier ? item.randomMultiplier : 1)

              this.allBets.push(`+${formatCurrency(withMultiplier)}`)
              useCreditStore().setCurrentBalance(
                useCreditStore().getCurrentBalance + withMultiplier,
              )
            }, 500)
            setTimeout(() => {
              this.betOnAce = item.betAmount
              this.showSpinTheWheel = true
            }, 1000)
          }
        }

        // If the item is the highest card and no lucky card bet exists
        if (item.value === highestCard.value && hasLuckyCard < 0) {
          const withMultiplier =
            item.betAmount * (item.randomMultiplier ? item.randomMultiplier : 1)
          this.allBets.push(`+${formatCurrency(withMultiplier)}`)
          useCreditStore().setCurrentBalance(useCreditStore().getCurrentBalance + withMultiplier)
          console.log('Item is the highest card!')
        }

        // If the item is not the highest card nor the lucky card
        if (
          item.value !== highestCard.value &&
          (hasLuckyCard < 0 || item.value !== this.selectedCards[hasLuckyCard]?.value)
        ) {
          this.allBets.push(`-${formatCurrency(item.betAmount)}`)
          useCreditStore().setCurrentBalance(useCreditStore().getCurrentBalance - item.betAmount)
          console.log('Not the highest nor the lucky card')
        }
      })

      // setTimeout(() => {
      //   handleEndOfGame()
      // }, 1000)
    },

    handleResetCard() {
      let intervalId: number | undefined = undefined
      this.timer = 3
      this.revealCards = false
      this.start_game = 'DONE'
      this.game_status = 'PENDING'

      this.four_random_cards = []
      this.selectedCards = []

      this.allBets = []
      this.allBots = []

      this.four_random_cards = getRandomCards(Cards)

      if (intervalId !== undefined) {
        clearInterval(intervalId)
        intervalId = undefined
      }

      setTimeout(() => {
        intervalId = setInterval(() => {
          if (this.timer > 0) {
            this.timer--
          } else {
            clearInterval(intervalId)
            intervalId = undefined
          }
        }, 1000)
      }, 500)

      setTimeout(() => {
        this.timer = 10
        // Force a re-update of dimensions before starting
        this.start_game = 'START'
      }, 4000)
    },

    handleSelectCard(index: number) {
      if (this.revealCards) return

      const currentBalance = useCreditStore().getCurrentBalance
      if (!currentBalance) {
        console.log('Please top up first, you have no balance!')
        return
      }

      this.showBetDrawer = true
      const foundCard = this.four_random_cards[index]
      this.currentSelectedCard = {
        card: foundCard,
        index,
      }
    },

    handleSelectBet(betValue: number) {
      if (!this.currentSelectedCard) {
        console.log('No card selected!')
        return
      }

      const currentBalance = useCreditStore().getCurrentBalance
      if (currentBalance < betValue) {
        console.log('Insufficient balance!')
        this.showBetDrawer = false
        return
      }

      const selectedCardIndex = this.selectedCards.findIndex(
        (item) => item.value === this.currentSelectedCard?.card.value,
      )

      if (selectedCardIndex !== -1) {
        // Update existing card
        const oldBet = this.selectedCards[selectedCardIndex].betAmount
        const newBet = betValue

        // Update `FourCards` total bet by subtracting old bet and adding new bet
        this.four_random_cards[this.currentSelectedCard.index].totalBet -= oldBet
        this.four_random_cards[this.currentSelectedCard.index].totalBet += newBet

        // Update `selectedCard` bet amount
        this.selectedCards[selectedCardIndex] = {
          ...this.selectedCards[selectedCardIndex],
          betAmount: newBet,
        }
      } else {
        // Add new card to `selectedCard`
        this.selectedCards.push({
          ...this.currentSelectedCard.card,
          betAmount: betValue,
        })

        // Update `FourCards` total bet and player count
        this.four_random_cards[this.currentSelectedCard.index].totalBet += betValue
        this.four_random_cards[this.currentSelectedCard.index].playerCount += 1
      }

      this.showBetDrawer = false
    },
  },
})
