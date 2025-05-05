import { botNames, Cards } from '@/models/constants'
import { useCreditStore, useGameStore } from '@/stores'
import { formatCurrency } from '@/utils/convertMoney'
import { getRandomCards } from '@/utils/getRandomCards'
export class GameLogic {
  private intervalId: number | undefined = undefined
  private resetCountdownId: number | undefined = undefined
  private timeouts: number[] = []

  addTimeout(timeoutId: number) {
    this.timeouts.push(timeoutId)
  }

  clearAllTimeouts() {
    this.timeouts.forEach(clearTimeout)
    this.timeouts = []
  }

  getIntervalId() {
    return this.intervalId
  }

  setIntervalId(value: number | undefined) {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
    this.intervalId = value
  }

  setResetCountdownId(value: number | undefined) {
    if (this.resetCountdownId !== undefined) {
      clearInterval(this.resetCountdownId)
      this.resetCountdownId = undefined
    }
    this.resetCountdownId = value
  }

  cleanupAllIntervals() {
    this.setIntervalId(undefined)
    this.setResetCountdownId(undefined)
  }

  handleEndOfGame() {
    const gameStore = useGameStore()
    const totalBet = gameStore.getFourCards.reduce((sum, card) => sum + card.totalBet, 0)
    const fivePercent = totalBet * 0.05

    if (fivePercent > 0) {
      const jackpot = gameStore.accumulatedJackpot + fivePercent
      gameStore.setAccumulatedJackpot(jackpot)
      localStorage.setItem('accumulatedJackpot', jackpot.toString())
    }
  }

  initializeGame() {
    const gameStore = useGameStore()

    this.cleanupAllIntervals()
    gameStore.setStartingIn(5)
    gameStore.setRevealCard(false)
    gameStore.setStartGame('PENDING')
    gameStore.setGameStatus('PENDING')
    gameStore.setFourCards([])
    gameStore.setSelectedCards([])
    gameStore.setAllBets([])
    gameStore.setAllBots([])
    gameStore.setTotalPlayers(0)

    const cards = getRandomCards(Cards)
    cards.forEach((item) => {
      console.log(`${item.value}`)
    })
    gameStore.setFourCards(cards)
    gameStore.setStartGame('PENDING')

    const newIntervalId = setInterval(() => {
      if (gameStore.getStartinIn > 0) {
        gameStore.decreaseStartingIn()
      } else {
        // Clear interval and reset the intervalId
        this.setIntervalId(undefined)

        const timeoutId = setTimeout(() => {
          gameStore.setStartGame('START')
        }, 500)
        this.addTimeout(timeoutId)
      }
    }, 1000)

    this.setIntervalId(newIntervalId)
  }

  handleCancelBet() {
    const gameStore = useGameStore()
    gameStore.setDrawer(false)
    gameStore.setCurrentSelectedCard(null)
  }

  getHighestCard() {
    const gameStore = useGameStore()
    const cards = gameStore.getFourCards
    if (cards.length === 0) return null

    const highestCard = cards.reduce((max, curr) => (curr.value > max.value ? curr : max))

    const timeoutId = setTimeout(() => {
      const selectedCards = gameStore.getSelectedCards
      const hasLuckyCard = selectedCards.some((card) => card.value === 1)

      if (hasLuckyCard) {
        gameStore.setGameStatus('WIN')
        return
      }

      const hasHighestCard = selectedCards.some((card) => card.value === highestCard.value)
      gameStore.setGameStatus(hasHighestCard ? 'WIN' : 'LOSE')
    }, 500)
    this.addTimeout(timeoutId)
    return highestCard
  }

  handleRevealCard() {
    const gameStore = useGameStore()
    const creditStore = useCreditStore()

    gameStore.setRevealCard(true)

    const cards = gameStore.getFourCards
    if (cards.length === 0) return null

    const highestCard = cards.reduce((max, curr) => (curr.value > max.value ? curr : max))
    const selectedCards = gameStore.getSelectedCards
    const luckyCardIndex = selectedCards.findIndex((card) => card.value === 1)

    selectedCards.forEach((item) => {
      const luckyCard = selectedCards[luckyCardIndex]

      // item is lucky ace card
      if (luckyCardIndex >= 0 && item.value === luckyCard.value) {
        const updateSpinTheWheelTimeoutId = setTimeout(() => {
          gameStore.setBetOnAce(item.betAmount)
          gameStore.setShowSpinTheWheel(true)
        }, 1000)
        this.addTimeout(updateSpinTheWheelTimeoutId)
      }

      // item is highest card (and not the lucky ace card)
      if (item.value === highestCard.value && luckyCardIndex < 0) {
        console.log('highest!')
        const win = item.betAmount * (item.randomMultiplier ?? 1)

        const winBannerDelay = setTimeout(() => {
          gameStore.setBetOnCard(win)
          gameStore.setWinBanner(true)
        }, 1000)
        this.addTimeout(winBannerDelay)

        const updatedBets = [...gameStore.getAllBets, `+${formatCurrency(win)}`]
        gameStore.setAllBets(updatedBets)
        creditStore.setCurrentBalance(creditStore.getCurrentBalance + win)
      }

      if (
        item.value !== highestCard.value &&
        (luckyCardIndex < 0 || item.value !== luckyCard?.value)
      ) {
        const updatedBets = [...gameStore.getAllBets, `-${formatCurrency(item.betAmount)}`]
        gameStore.setAllBets(updatedBets)
        creditStore.setCurrentBalance(creditStore.getCurrentBalance - item.betAmount)
      }
    })

    const timeoutId = setTimeout(() => {
      this.handleEndOfGame()
    }, 1000)
    this.addTimeout(timeoutId)
  }

  handleResetCard() {
    const gameStore = useGameStore()

    this.cleanupAllIntervals()
    gameStore.setTimer(5)
    gameStore.setRevealCard(false)
    gameStore.setStartGame('DONE')
    gameStore.setGameStatus('PENDING')
    gameStore.setFourCards([])
    gameStore.setSelectedCards([])
    gameStore.setAllBets([])
    gameStore.setAllBots([])
    gameStore.setTotalPlayers(0)
    gameStore.setWinBanner(false)

    const newCards = getRandomCards(Cards)
    gameStore.setFourCards(newCards)
    newCards.forEach((item) => {
      console.log(`${item.value}`)
    })

    const countDownTimer = setTimeout(() => {
      const countdownIntervalId = setInterval(() => {
        if (gameStore.getTimer > 0) {
          gameStore.decreaseTimer()
        } else {
          // Clear the reset countdown interval
          this.setResetCountdownId(undefined)
        }
      }, 1000)

      this.setResetCountdownId(countdownIntervalId)
    }, 500)
    this.addTimeout(countDownTimer)

    const resetTimer = setTimeout(() => {
      this.cleanupAllIntervals()
      gameStore.setTimer(10)
      gameStore.setStartGame('START')
    }, 7000)
    this.addTimeout(resetTimer)
  }

  handleSelectCard(index: number) {
    const gameStore = useGameStore()
    const creditStore = useCreditStore()
    if (gameStore.getIsRevealCards) return
    if (!creditStore.getCurrentBalance) {
      console.log('Please top up first, you have no balance!')
      return
    }

    const card = gameStore.getFourCards[index]
    gameStore.setCurrentSelectedCard({ card, index })
    gameStore.setDrawer(true)
  }

  handleSelectBet(betValue: number) {
    const gameStore = useGameStore()
    const creditStore = useCreditStore()

    const currentCard = gameStore.getCurrentSelectedCard
    if (!currentCard) {
      console.log('No card selected!')
      return
    }

    if (creditStore.getCurrentBalance < betValue) {
      console.log('Insufficient balance!')
      gameStore.setShowSpinTheWheel(false)
      return
    }

    const selectedIndex = gameStore.getSelectedCards.findIndex(
      (item) => item.value === currentCard.card.value,
    )

    const cards = [...gameStore.getFourCards]
    const selectedCards = [...gameStore.getSelectedCards]

    if (selectedIndex !== -1) {
      const oldBet = selectedCards[selectedIndex].betAmount
      selectedCards[selectedIndex].betAmount = betValue
      cards[currentCard.index].totalBet = cards[currentCard.index].totalBet - oldBet + betValue
    } else {
      selectedCards.push({
        ...currentCard.card,
        betAmount: betValue,
      })
      cards[currentCard.index].totalBet += betValue
      cards[currentCard.index].playerCount += 1
    }

    gameStore.setSelectedCards(selectedCards)
    gameStore.setFourCards(cards)
    gameStore.setDrawer(false)
  }

  handleGenerateBots() {
    const gameStore = useGameStore()

    gameStore.setAllBots([])
    const availableBotNames = [...botNames]
    const botRandomAmount = Math.floor(Math.random() * 21) // 0 to 20
    const bot_bet_choices = [1, 5, 10, 50, 500, 100, 500, 1000, 5000, 10000]

    for (let i = 0; i < botRandomAmount; i++) {
      const bot_name_index = Math.floor(Math.random() * availableBotNames.length)
      const bot_name = availableBotNames[bot_name_index]
      availableBotNames.splice(bot_name_index, 1)

      const numberOfBets = Math.floor(Math.random() * 4) + 1 // bot can bet on 1 - 4  no. of cards
      const uniqueCardIndexes = new Set<number>()

      while (uniqueCardIndexes.size < numberOfBets) {
        uniqueCardIndexes.add(Math.floor(Math.random() * 4))
      }

      const bot_cards = Array.from(uniqueCardIndexes).map((card_index) => ({
        card_index,
        bot_bet_amount: bot_bet_choices[Math.floor(Math.random() * bot_bet_choices.length)],
      }))

      const updatedBots = [...gameStore.getAllBots, { bot_name, bot_cards }]
      gameStore.setAllBots(updatedBots)
    }
  }

  handleDistributeBot() {
    const gameStore = useGameStore()
    const bots = gameStore.getAllBots

    let accumulatedDelay = Math.floor(Math.random() * 1001) + 500 // 2000–4000ms initial delay

    bots.forEach((bot) => {
      const botDelay = Math.floor(Math.random() * 300) + 200
      accumulatedDelay += botDelay

      const addBotTimeout = setTimeout(() => {
        gameStore.setTotalPlayers((gameStore.totalPlayers += 1))
        bot.bot_cards.forEach(({ card_index, bot_bet_amount }) => {
          gameStore.getFourCards[card_index].totalBet += bot_bet_amount
          gameStore.getFourCards[card_index].playerCount += 1
        })
      }, accumulatedDelay)
      this.addTimeout(addBotTimeout)
    })
  }
  // In GameLogic class
  cleanupAll() {
    // Clear all intervals
    this.setIntervalId(undefined)
    this.setResetCountdownId(undefined)

    // Clear all timeouts
    this.clearAllTimeouts()
  }

  resetGameState() {
    const gameStore = useGameStore()

    this.setIntervalId(undefined)
    this.setResetCountdownId(undefined)
    this.clearAllTimeouts()

    // Reset all game state
    gameStore.setStartingIn(5)
    gameStore.setTimer(10)
    gameStore.setRevealCard(false)
    gameStore.setStartGame('PENDING')
    gameStore.setGameStatus('PENDING')
    gameStore.setFourCards([])
    gameStore.setSelectedCards([])
    gameStore.setAllBets([])
    gameStore.setAllBots([])
    gameStore.setTotalPlayers(0)
    gameStore.setCurrentSelectedCard(null)
    gameStore.setDrawer(false)
    gameStore.setShowSpinTheWheel(false)
  }
}

const gameLogicInstance = new GameLogic()
export default gameLogicInstance
