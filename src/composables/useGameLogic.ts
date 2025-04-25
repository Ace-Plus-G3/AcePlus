import { botNames, Cards } from '@/models/constants'
import type { TBotsCards } from '@/models/type'
import { useCreditStore, useGameStore } from '@/stores'
import { formatCurrency } from '@/utils/convertMoney'
import { getRandomCards } from '@/utils/getRandomCards'

export class GameLogic {
  private intervalId: number | undefined = undefined

  getIntervalId() {
    return this.intervalId
  }

  setIntervalId(value: number | undefined) {
    // Clear any existing interval when setting a new one or clearing
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId)
    }
    this.intervalId = value
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
    const cards = getRandomCards(Cards)
    useGameStore().setFourCards(cards)
    useGameStore().setStartGame('PENDING')

    // Always clear existing interval first
    this.setIntervalId(undefined)

    const newIntervalId = setInterval(() => {
      if (useGameStore().getStartinIn > 0) {
        useGameStore().decreaseStartingIn()
      } else {
        // Clear interval and reset the intervalId
        this.setIntervalId(undefined)

        setTimeout(() => {
          useGameStore().setStartGame('START')
        }, 200)
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

    setTimeout(() => {
      const selectedCards = useGameStore().getSelectedCards
      const hasLuckyCard = selectedCards.some((card) => card.value === 1)

      if (hasLuckyCard) {
        useGameStore().setGameStatus('WIN')
        return
      }

      const hasHighestCard = selectedCards.some((card) => card.value === highestCard.value)
      useGameStore().setGameStatus(hasHighestCard ? 'WIN' : 'LOSE')
    }, 500)

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
        const withMultiplier = item.betAmount * (item.randomMultiplier ?? 1)
        setTimeout(() => {
          const updatedBets = [...useGameStore().getAllBets, `+${formatCurrency(withMultiplier)}`]
          useGameStore().setAllBets(updatedBets)
          useCreditStore().setCurrentBalance(useCreditStore().getCurrentBalance + withMultiplier)
        }, 500)

        setTimeout(() => {
          useGameStore().setBetOnAce(item.betAmount)
          useGameStore().setShowSpinTheWheel(true)
        }, 1000)
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

    setTimeout(() => {
      this.handleEndOfGame()
    }, 1000)
  }

  handleResetCard() {
    // Make sure any existing timer is cleared first
    this.setIntervalId(undefined)

    useGameStore().setTimer(3)
    useGameStore().setRevealCard(false)
    useGameStore().setStartGame('DONE')
    useGameStore().setGameStatus('PENDING')
    useGameStore().setFourCards([])
    useGameStore().setSelectedCards([])
    useGameStore().setAllBets([])
    useGameStore().setAllBots([])

    const newCards = getRandomCards(Cards)
    useGameStore().setFourCards(newCards)

    // Create a temporary interval for the reset countdown
    setTimeout(() => {
      const countdownIntervalId = setInterval(() => {
        if (useGameStore().getTimer > 0) {
          useGameStore().decreaseTimer()
        } else {
          // Clear and reset intervalId when countdown completes
          clearInterval(countdownIntervalId)
        }
      }, 1000)

      // We don't set this as the main intervalId to avoid conflicts
    }, 500)

    setTimeout(() => {
      useGameStore().setTimer(10)
      useGameStore().setStartGame('START')
    }, 4000)
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

  handleDistributeBot = () => {
    let accumulatedDelay = 0

    useGameStore().getAllBots.forEach((bot) => {
      const randomDelay = Math.floor(Math.random() * 5000) + 500
      accumulatedDelay += randomDelay

      setTimeout(() => {
        bot.bot_cards.forEach((bot_card) => {
          useGameStore().getFourCards[bot_card.card_index].totalBet += bot_card.bot_bet_amount
          useGameStore().getFourCards[bot_card.card_index].playerCount += 1
        })
      }, accumulatedDelay)
    })
  }

  handleGenerateBots = () => {
    const botRandomAmount = Math.floor(Math.random() * 20)
    const bot_bet_choices = [1, 5, 10, 50, 500, 100, 500, 1000, 5000, 10000]

    for (let i = 0; i <= botRandomAmount; i++) {
      const bot_random_choice_of_card = Math.floor(Math.random() * 4)

      const bot_name = botNames[Math.floor(Math.random() * botNames.length)]
      botNames.splice(Math.floor(Math.random() * botNames.length), 1)

      const bot_cards: TBotsCards[] = []
      for (let j = 0; j <= bot_random_choice_of_card; j++) {
        bot_cards.push({
          card_index: j,
          bot_bet_amount: bot_bet_choices[Math.floor(Math.random() * bot_bet_choices.length)],
        })
      }
      const updatedBots = [...useGameStore().getAllBots, { bot_name, bot_cards }]
      useGameStore().setAllBots(updatedBots)
    }
  }
}

const gameLogicInstance = new GameLogic()
export default gameLogicInstance
