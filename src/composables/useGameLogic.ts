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
    const totalBet = useGameStore().getFourCards.reduce((sum, card) => sum + card.totalBet, 0)
    const fivePercent = totalBet * 0.05

    if (fivePercent > 0) {
      const jackpot = useGameStore().accumulatedJackpot + fivePercent
      useGameStore().setAccumulatedJackpot(jackpot)
      localStorage.setItem('accumulatedJackpot', jackpot.toString())
    }
  }

  initializeGame() {
    // Clean up any existing intervals first
    this.cleanupAllIntervals()

    useGameStore().setStartingIn(5) // Reset starting timer to initial value
    useGameStore().setRevealCard(false)
    useGameStore().setStartGame('PENDING')
    useGameStore().setGameStatus('PENDING')
    useGameStore().setFourCards([])
    useGameStore().setSelectedCards([])
    useGameStore().setAllBets([])
    useGameStore().setAllBots([])
    useGameStore().setTotalPlayers(0)

    const cards = getRandomCards(Cards)
    cards.forEach((item) => {
      console.log(`${item.value}`)
    })
    useGameStore().setFourCards(cards)
    useGameStore().setStartGame('PENDING')

    const newIntervalId = setInterval(() => {
      if (useGameStore().getStartinIn > 0) {
        useGameStore().decreaseStartingIn()
      } else {
        // Clear interval and reset the intervalId
        this.setIntervalId(undefined)

        const timeoutId = setTimeout(() => {
          useGameStore().setStartGame('START')
        }, 200)
        this.addTimeout(timeoutId)
      }
    }, 1000)

    this.setIntervalId(newIntervalId)
  }

  handleCancelBet() {
    useGameStore().setDrawer(false)
    useGameStore().setCurrentSelectedCard(null)
  }

  getHighestCard() {
    const cards = useGameStore().getFourCards
    if (cards.length === 0) return null

    const highestCard = cards.reduce((max, curr) => (curr.value > max.value ? curr : max))

    const timeoutId = setTimeout(() => {
      const selectedCards = useGameStore().getSelectedCards
      const hasLuckyCard = selectedCards.some((card) => card.value === 1)

      if (hasLuckyCard) {
        useGameStore().setGameStatus('WIN')
        return
      }

      const hasHighestCard = selectedCards.some((card) => card.value === highestCard.value)
      useGameStore().setGameStatus(hasHighestCard ? 'WIN' : 'LOSE')
    }, 500)
    this.addTimeout(timeoutId)
    return highestCard
  }

  handleRevealCard() {
    useGameStore().setRevealCard(true)

    const cards = useGameStore().getFourCards
    if (cards.length === 0) return null

    const highestCard = cards.reduce((max, curr) => (curr.value > max.value ? curr : max))
    const selectedCards = useGameStore().getSelectedCards
    const luckyCardIndex = selectedCards.findIndex((card) => card.value === 1)

    selectedCards.forEach((item) => {
      const luckyCard = selectedCards[luckyCardIndex]

      if (luckyCardIndex >= 0 && item.value === luckyCard.value) {
        // const withMultiplier = item.betAmount * (item.randomMultiplier ?? 1)
        // const updateBalanceTimeoutId = setTimeout(() => {
        //   const updatedBets = [...useGameStore().getAllBets, `+${formatCurrency(withMultiplier)}`]
        //   useGameStore().setAllBets(updatedBets)
        //   useCreditStore().setCurrentBalance(useCreditStore().getCurrentBalance + withMultiplier)
        // }, 500)
        // this.addTimeout(updateBalanceTimeoutId)

        const updateSpinTheWheelTimeoutId = setTimeout(() => {
          useGameStore().setBetOnAce(item.betAmount)
          useGameStore().setShowSpinTheWheel(true)
        }, 1000)
        this.addTimeout(updateSpinTheWheelTimeoutId)
      }

      if (item.value === highestCard.value && luckyCardIndex < 0) {
        const win = item.betAmount * (item.randomMultiplier ?? 1)
        const updatedBets = [...useGameStore().getAllBets, `+${formatCurrency(win)}`]
        useGameStore().setAllBets(updatedBets)
        useCreditStore().setCurrentBalance(useCreditStore().getCurrentBalance + win)
      }

      if (
        item.value !== highestCard.value &&
        (luckyCardIndex < 0 || item.value !== luckyCard?.value)
      ) {
        const updatedBets = [...useGameStore().getAllBets, `-${formatCurrency(item.betAmount)}`]
        useGameStore().setAllBets(updatedBets)
        useCreditStore().setCurrentBalance(useCreditStore().getCurrentBalance - item.betAmount)
      }
    })

    const timeoutId = setTimeout(() => {
      this.handleEndOfGame()
    }, 1000)
    this.addTimeout(timeoutId)
  }

  handleResetCard() {
    this.cleanupAllIntervals()

    useGameStore().setTimer(3)
    useGameStore().setRevealCard(false)
    useGameStore().setStartGame('DONE')
    useGameStore().setGameStatus('PENDING')
    useGameStore().setFourCards([])
    useGameStore().setSelectedCards([])
    useGameStore().setAllBets([])
    useGameStore().setAllBots([])
    useGameStore().setTotalPlayers(0)

    const newCards = getRandomCards(Cards)
    useGameStore().setFourCards(newCards)

    const countDownTimer = setTimeout(() => {
      const countdownIntervalId = setInterval(() => {
        if (useGameStore().getTimer > 0) {
          useGameStore().decreaseTimer()
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
      useGameStore().setTimer(10)
      useGameStore().setStartGame('START')
    }, 4000)
    this.addTimeout(resetTimer)
  }

  handleSelectCard(index: number) {
    if (useGameStore().getIsRevealCards) return
    if (!useCreditStore().getCurrentBalance) {
      console.log('Please top up first, you have no balance!')
      return
    }

    const card = useGameStore().getFourCards[index]
    useGameStore().setCurrentSelectedCard({ card, index })
    useGameStore().setDrawer(true)
  }

  handleSelectBet(betValue: number) {
    const currentCard = useGameStore().getCurrentSelectedCard
    if (!currentCard) {
      console.log('No card selected!')
      return
    }

    if (useCreditStore().getCurrentBalance < betValue) {
      console.log('Insufficient balance!')
      useGameStore().setShowSpinTheWheel(false)
      return
    }

    const selectedIndex = useGameStore().getSelectedCards.findIndex(
      (item) => item.value === currentCard.card.value,
    )

    const cards = [...useGameStore().getFourCards]
    const selectedCards = [...useGameStore().getSelectedCards]

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

    useGameStore().setSelectedCards(selectedCards)
    useGameStore().setFourCards(cards)
    useGameStore().setDrawer(false)
  }

  handleGenerateBots() {
    useGameStore().setAllBots([])

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

      const updatedBots = [...useGameStore().getAllBots, { bot_name, bot_cards }]
      useGameStore().setAllBots(updatedBots)
    }
  }

  handleDistributeBot() {
    const bots = useGameStore().getAllBots

    let accumulatedDelay = Math.floor(Math.random() * 1001) + 500 // 2000–4000ms initial delay

    bots.forEach((bot) => {
      const botDelay = Math.floor(Math.random() * 300) + 200
      accumulatedDelay += botDelay

      const addBotTimeout = setTimeout(() => {
        useGameStore().setTotalPlayers((useGameStore().totalPlayers += 1))
        bot.bot_cards.forEach(({ card_index, bot_bet_amount }) => {
          useGameStore().getFourCards[card_index].totalBet += bot_bet_amount
          useGameStore().getFourCards[card_index].playerCount += 1
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
    this.setIntervalId(undefined)
    this.setResetCountdownId(undefined)
    this.clearAllTimeouts()

    // Reset all game state
    useGameStore().setStartingIn(5)
    useGameStore().setTimer(10)
    useGameStore().setRevealCard(false)
    useGameStore().setStartGame('PENDING')
    useGameStore().setGameStatus('PENDING')
    useGameStore().setFourCards([])
    useGameStore().setSelectedCards([])
    useGameStore().setAllBets([])
    useGameStore().setAllBots([])
    useGameStore().setTotalPlayers(0)
    useGameStore().setCurrentSelectedCard(null)
    useGameStore().setDrawer(false)
    useGameStore().setShowSpinTheWheel(false)
  }
}

const gameLogicInstance = new GameLogic()
export default gameLogicInstance
