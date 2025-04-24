<template>
  <el-container>
    <el-header>
      <div class="el-header-top-bar">
        <div class="el-header-image">
          <button class="leave-btn" @click="router.push('/')">Leave</button>
          <div class="jackpot-container">
            <el-text class="jackpot-amount">
              {{ formatCurrency(outputValue) }}
            </el-text>
            <div class="jackpot-text-container">
              <img :src="JackpotText" class="jackpot-text" alt="" />
            </div>
          </div>
          <div class="chip-amount">
            <el-text class="chip-amount-text" style="color: white" size="small">{{
              convertToReadableFormat(useCreditStore().getCurrentBalance)
            }}</el-text>
          </div>
        </div>
      </div>
    </el-header>

    <!-- Start of Overlays -->
    <PlayerWins :game_status="game_status" />
    <GameTimer :starting-in="startingIn" :timer="timer" />
    <StartingInView :starting-in="startingIn" />
    <div class="spin-overlay" v-if="showSpinTheWheel">
      <SpinTheWheel @handle-close="handleCloseWheel" :bet-amount="betOnAce" />
    </div>
    <!-- End of Overlays -->

    <el-main>
      <div class="game-container" ref="gameContainerRef" :disabled="startGame === 'Start'">
        <el-image fit="cover" :src="cardBack" alt="card_back_bg" class="card" />
        <BetWin v-for="(item, index) in allBets" :key="item" :bet="item" :index="index" />
        <CustomCardView
          v-for="(_, index) in FourCards"
          :key="index"
          :index="index"
          :length="4"
          :start="startGame"
          :delay="index * 200"
          :reveal="reveal"
          @handle-select-card="handleSelectCard"
          :selected-card="selectedCard"
          :four-cards="FourCards"
          :container-width="containerWidth"
          :container-height="containerHeight"
        />
      </div>
    </el-main>

    <el-footer>
      <div class="el-footer-bottom-bar">
        <div class="el-footer-image">
          <span class="title">Place your bets !</span>
        </div>
      </div>
    </el-footer>

    <el-drawer direction="btt" @close="drawer = false" v-model="drawer" :with-header="false">
      <div class="custom-drawer">
        <div class="custom-drawer-header">
          <span class="title">Place your bets !</span>
          <button class="cancel-btn" @click="handleCancel">Cancel</button>
        </div>
        <div class="drawer-content">
          <div class="bet-grid">
            <div
              @click="handleSelectBet(chip.value)"
              v-for="chip in chips"
              :key="chip.value"
              class="chip"
            >
              <img :src="chip.image" :alt="String(chip.value)" />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </el-container>
</template>

<script setup lang="ts">
import SpinTheWheel from '@/components/SpinTheWheel.vue'
import CustomCardView from '@/components/CustomCardView.vue'
import { Cards, chips } from '@/models/constants'
import { type TBots, type TBotsCards, type TCardType, type TSelectedCard } from '@/models/type'
import { onMounted, ref, watch, onBeforeUnmount, nextTick, onUnmounted, computed } from 'vue'
import cardBack from '@/assets/cards/back/card_back_bg.png'
import PlayerWins from '@/components/overlays/PlayerWins.vue'
import StartingInView from '@/components/overlays/StartingInView.vue'
import GameTimer from '@/components/overlays/GameTimer.vue'
import { getRandomCards } from '@/utils/getRandomCards'
import { useRouter } from 'vue-router'
import { useCreditStore } from '@/stores'
import { convertToReadableFormat, formatCurrency } from '@/utils/convertMoney'
import BetWin from '@/components/overlays/BetWin.vue'
import JackpotText from '@/assets/jackpot-text.png'
import { useTransition } from '@vueuse/core'

const router = useRouter()

const gameContainerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const containerHeight = ref(0)

let intervalId: number | undefined = undefined
const timer = ref(10)
const startingIn = ref(5)

const drawer = ref(false)
const reveal = ref(false)
const showSpinTheWheel = ref(false)
const betOnAce = ref(0) // store here the player's, bet on ace card

const startGame = ref<'Start' | 'Pending' | 'Done'>('Pending')
const game_status = ref<'WIN' | 'LOSE' | 'PENDING'>('PENDING')

const FourCards = ref<TCardType[]>([])
const selectedCard = ref<TSelectedCard[]>([])
const allBets = ref<string[]>([])

const allBots = ref<TBots[]>([])
const accumulatedJackpot = ref(0)
const source = ref(0)
const outputValue = useTransition(source, { duration: 1000 })

const totalBetAmount = computed(() =>
  FourCards.value.reduce((total, card) => total + card.totalBet, 0),
)

const fivePercentOfTotalBet = computed(() => totalBetAmount.value * 0.05)

const handleEndOfGame = () => {
  if (fivePercentOfTotalBet.value > 0) {
    accumulatedJackpot.value += fivePercentOfTotalBet.value
    localStorage.setItem('accumulatedJackpot', String(accumulatedJackpot.value))
  }
}

const currentSelectedCard = ref<{
  index: number
  card: TCardType
} | null>(null)

const updateContainerDimensions = async () => {
  await nextTick()
  if (gameContainerRef.value) {
    const rect = gameContainerRef.value.getBoundingClientRect()
    containerWidth.value = rect.width
    containerHeight.value = rect.height
  }
}

const getHighestCard = () => {
  if (FourCards.value.length === 0) {
    return null
  }

  const highestCard = FourCards.value.reduce((maxCard, currentCard) => {
    return currentCard.value > maxCard.value ? currentCard : maxCard
  })

  setTimeout(() => {
    const hasLuckyCard = selectedCard.value.some((card: TCardType) => card.value === 1)

    if (hasLuckyCard) {
      game_status.value = 'WIN'
      return
    }

    const hasHighestCard = selectedCard.value.some(
      (card: TCardType) => card.value === highestCard.value,
    )

    if (hasHighestCard) {
      game_status.value = 'WIN'
    } else {
      game_status.value = 'LOSE'
    }
  }, 500)

  return highestCard
}

const handleResetCard = () => {
  timer.value = 3
  reveal.value = false
  startGame.value = 'Done'
  game_status.value = 'PENDING'

  FourCards.value = []
  selectedCard.value = []
  allBets.value = []
  allBots.value = []
  currentSelectedCard.value = null
  shuffleCard()

  if (intervalId !== undefined) {
    clearInterval(intervalId)
    intervalId = undefined
  }

  setTimeout(() => {
    intervalId = setInterval(() => {
      if (timer.value > 0) {
        timer.value--
      } else {
        clearInterval(intervalId)
        intervalId = undefined
      }
    }, 1000)
  }, 500)

  setTimeout(() => {
    timer.value = 10
    // Force a re-update of dimensions before starting
    updateContainerDimensions().then(() => {
      startGame.value = 'Start'
    })
  }, 4000)
}

const shuffleCard = () => {
  FourCards.value = getRandomCards(Cards)

  // FourCards.value.forEach((item) => {
  //   console.log(`Value:${item.value}, Multiplier: ${item.randomMultiplier}`)
  // })
}

const handleSelectCard = (index: number | null) => {
  if (index === null) {
    selectedCard.value = []

    return
  }

  if (reveal.value) return

  const currentBalance = useCreditStore().getCurrentBalance
  if (!currentBalance) {
    console.log('Please top up first, you have no balance')
    return
  }

  drawer.value = true
  const foundCard = FourCards.value[index]
  currentSelectedCard.value = {
    card: foundCard,
    index,
  }
}

const handleSelectBet = (betValue: number) => {
  if (!currentSelectedCard.value) {
    console.log('No card selected!')
    return
  }

  const currentBalance = useCreditStore().getCurrentBalance
  if (currentBalance < betValue) {
    console.log('Insufficient balance!')
    drawer.value = false
    return
  }

  const selectedCardIndex = selectedCard.value.findIndex(
    (item) => item.value === currentSelectedCard.value?.card.value,
  )

  if (selectedCardIndex !== -1) {
    // Update existing card
    const oldBet = selectedCard.value[selectedCardIndex].betAmount
    const newBet = betValue

    console.log(`Old Bet: ${oldBet}`)
    console.log(`New Bet: ${newBet}`)

    // Update `FourCards` total bet by subtracting old bet and adding new bet
    FourCards.value[currentSelectedCard.value.index].totalBet -= oldBet
    FourCards.value[currentSelectedCard.value.index].totalBet += newBet

    // Update `selectedCard` bet amount
    selectedCard.value[selectedCardIndex] = {
      ...selectedCard.value[selectedCardIndex],
      betAmount: newBet,
    }
  } else {
    // Add new card to `selectedCard`
    selectedCard.value.push({
      ...currentSelectedCard.value.card,
      betAmount: betValue,
    })

    // Update `FourCards` total bet and player count
    FourCards.value[currentSelectedCard.value.index].totalBet += betValue
    FourCards.value[currentSelectedCard.value.index].playerCount += 1
  }

  drawer.value = false
}

const handleResize = () => {
  updateContainerDimensions()
}

const initializeGame = async () => {
  await updateContainerDimensions()

  shuffleCard()

  // Initial game state
  startGame.value = 'Pending'

  if (intervalId !== undefined) {
    clearInterval(intervalId)
  }

  intervalId = setInterval(() => {
    if (startingIn.value > 0) {
      startingIn.value--
    } else {
      clearInterval(intervalId)
      intervalId = undefined

      updateContainerDimensions().then(() => {
        setTimeout(() => {
          startGame.value = 'Start'
        }, 200)
      })
    }
  }, 1000)
}

const handleRevealCard = () => {
  reveal.value = true

  if (FourCards.value.length === 0) {
    return null
  }

  const highestCard = FourCards.value.reduce((maxCard, currentCard) =>
    currentCard.value > maxCard.value ? currentCard : maxCard,
  )
  const hasLuckyCard = selectedCard.value.findIndex((card: TCardType) => card.value === 1)

  selectedCard.value.forEach((item) => {
    if (hasLuckyCard >= 0) {
      if (item.value === highestCard.value && hasLuckyCard >= 0) {
        // Skip processing the highest card if the lucky card also exists
        console.log('SKIP SINCE the item is not the highest card and there is a lucky card')
        return
      }

      // If the item is the lucky card, spin the wheel
      if (item.value === selectedCard.value[hasLuckyCard].value) {
        setTimeout(() => {
          const withMultiplier =
            item.betAmount * (item.randomMultiplier ? item.randomMultiplier : 1)

          allBets.value.push(`+${formatCurrency(withMultiplier)}`)
          useCreditStore().setCurrentBalance(useCreditStore().getCurrentBalance + withMultiplier)
        }, 500)
        setTimeout(() => {
          betOnAce.value = item.betAmount
          showSpinTheWheel.value = true
        }, 1000)
      }
    }

    // If the item is the highest card and no lucky card bet exists
    if (item.value === highestCard.value && hasLuckyCard < 0) {
      const withMultiplier = item.betAmount * (item.randomMultiplier ? item.randomMultiplier : 1)
      allBets.value.push(`+${formatCurrency(withMultiplier)}`)
      useCreditStore().setCurrentBalance(useCreditStore().getCurrentBalance + withMultiplier)
      console.log('Item is the highest card!')
    }

    // If the item is not the highest card nor the lucky card
    if (
      item.value !== highestCard.value &&
      (hasLuckyCard < 0 || item.value !== selectedCard.value[hasLuckyCard]?.value)
    ) {
      allBets.value.push(`-${formatCurrency(item.betAmount)}`)
      useCreditStore().setCurrentBalance(useCreditStore().getCurrentBalance - item.betAmount)
      console.log('Not the highest nor the lucky card')
    }
  })

  setTimeout(() => {
    handleEndOfGame()
  }, 1000)
}

const handleCloseWheel = () => {
  showSpinTheWheel.value = false
}

const handleCancel = () => {
  drawer.value = false
  currentSelectedCard.value = null
}

const handleDistributeBot = () => {
  let accumulatedDelay = 0 // Keeps track of total delay time

  allBots.value.forEach((bot) => {
    // Generate a random delay between 1 to 10 seconds (in milliseconds)
    const randomDelay = Math.floor(Math.random() * 5000) + 500

    // Accumulate the delay for sequential execution
    accumulatedDelay += randomDelay

    setTimeout(() => {
      bot.bot_cards.forEach((bot_card) => {
        FourCards.value[bot_card.card_index].totalBet += bot_card.bot_bet_amount
        FourCards.value[bot_card.card_index].playerCount += 1
      })
    }, accumulatedDelay)
  })
}

const handleGenerateBots = () => {
  const botRandomAmount = Math.floor(Math.random() * 20) // how many bots per game
  const bot_bet_choices = [1, 5, 10, 50, 500, 100, 500, 1000, 5000, 10000] // amount of bet they can choice

  const names = [
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
  ]

  for (let i = 0; i <= botRandomAmount; i++) {
    const bot_random_choice_of_card = Math.floor(Math.random() * 4) // amount of card they can bet on

    const bot_name = names[Math.floor(Math.random() * names.length)]
    names.splice(Math.floor(Math.random() * names.length), 1)

    const bot_cards: TBotsCards[] = []
    for (let j = 0; j <= bot_random_choice_of_card; j++) {
      bot_cards.push({
        card_index: j,
        bot_bet_amount: bot_bet_choices[Math.floor(Math.random() * bot_bet_choices.length)],
      })
    }

    allBots.value.push({
      bot_name,
      bot_cards,
    })
  }
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)

  await nextTick()

  await updateContainerDimensions()

  initializeGame()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (intervalId !== undefined) {
    clearInterval(intervalId)
    intervalId = undefined
  }
})

onUnmounted(() => {
  if (intervalId !== undefined) {
    clearInterval(intervalId)
    intervalId = undefined
  }
})

onMounted(() => {
  const storedJackpot = localStorage.getItem('accumulatedJackpot')
  accumulatedJackpot.value = storedJackpot ? parseFloat(storedJackpot) : 0 // Default to 0 if no value exists
})

// Watch for changes in accumulatedJackpot and update source
watch(
  accumulatedJackpot,
  (newValue) => {
    source.value = newValue
  },
  { immediate: true },
)

watch(startGame, (newValue) => {
  if (newValue === 'Start') {
    if (intervalId !== undefined) {
      clearInterval(intervalId)
      intervalId = undefined
    }

    setTimeout(() => {
      handleGenerateBots()
      handleDistributeBot()
      intervalId = setInterval(() => {
        if (timer.value > 0) {
          timer.value--
        } else {
          clearInterval(intervalId)
          intervalId = undefined
        }
      }, 1000)
    }, 500)

    // After timer completes, reveal cards
    setTimeout(() => {
      handleCancel()
      getHighestCard()
      handleRevealCard()
    }, 10500)

    // Reset after reveal
    setTimeout(() => {
      handleResetCard()
    }, 12000)
  }
})
</script>

<style scoped>
.jackpot-text-container {
  background-size: cover;
  margin: 0 auto;
  z-index: 55;
  position: absolute;
  top: 103%;
  right: 38%;
}

.jackpot-text-container {
  display: flex;
}

.jackpot-amount {
  font-family: 'Roboto', sans-serif !important;
  font-weight: 900 !important;
  font-size: 3em;
  background: #915a10;
  background: linear-gradient(180deg, rgba(145, 90, 16, 1) 15%, rgba(68, 40, 2, 1) 75%);
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.jackpot-container {
  background-image: url('../assets/jackpot_bgg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 300px;
  height: 80px;
  margin-top: 55px;
  z-index: 50;
  display: flex;
  justify-content: center;
  flex-direction: column;
  /* position: absolute;
  right: 30%;
  top: 40%; */
}

.card {
  z-index: 20 !important;
}

.el-container {
  height: 100vh;
  background-image: url('@/assets/homepage_bg.png');
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 0;
  margin: 0;
}

.el-header {
  width: 100%;
  padding: 0 !important;
  margin: 0 !important;
  height: auto !important;

  display: flex;
  align-items: center;
  justify-content: center;

  .el-header-top-bar {
    max-width: 800px;
    min-width: 320px;
    width: 100%;
    aspect-ratio: 8.88 / 1;
    position: relative;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    margin: 0 !important;
  }

  .el-header-image {
    width: 100%;
    height: 100%;

    background-image: url('@/assets/game/topbar.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    z-index: 2;

    .chip-amount {
      background-image: url('@/assets/coins/chip_amount.png');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      width: 120px;
      height: 50px;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .leave-btn {
      height: 40px;
      width: 120px;

      background: #ffca28;
      border: none;
      border-radius: 20px;
      /* padding: 4px 12px; */
      font-size: 14px;
      font-weight: bold;
      color: #00397f;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      transition: background 0.3s;
    }
  }
}

.el-main {
  max-width: 800px;
  min-width: 320px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;

  .game-container {
    width: 100%;
    aspect-ratio: 2 / 1;
    max-height: 400px;
    background-image: url('@/assets/game/game_table.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    margin: 0;
    padding: 0;
  }

  .card {
    width: 80px;
    height: 120px;
    z-index: 1000;
    transform: translate(10px, -60px);
  }
}

.el-footer {
  width: 100%;
  padding: 0 !important;
  margin: 0 !important;
  height: auto !important;

  display: flex;
  align-items: center;
  justify-content: center;

  .el-footer-bottom-bar {
    max-width: 800px;
    min-width: 320px;
    width: 100%;
    aspect-ratio: 8.88 / 1;
    position: relative;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    margin: 0 !important;
  }

  .el-footer-image {
    width: 100%;
    height: 100%;

    background-image: url('@/assets/game/bottombar.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    z-index: 2;

    .title {
      color: #ffca28;
      font-weight: bold;
      font-size: 16px;
    }
  }
}

/* Drawer Styles*/
:deep(.el-overlay) {
  overflow: hidden !important;
  display: flex;
  justify-content: center;
}

:deep(.el-drawer) {
  overflow: hidden;
  background: none;
  height: 40% !important;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
}

:deep(.el-drawer__body) {
  padding: 0;
  margin: 0;
  max-width: 800px;
  min-width: 375px;
  width: 100%;
  height: 100%;
}

.custom-drawer {
  max-width: 800px;
  min-width: 375px;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Custom header */
.custom-drawer-header {
  max-width: 800px;
  min-width: 375px;
  width: 90%;
  aspect-ratio: 8.88 / 1;

  background-image: url('@/assets/game/bottombar.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  z-index: 2;
}

.drawer-content {
  width: 85%;
  height: 100%;
  z-index: 1;
  background-image: url('@/assets/game/drawer_bg.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  margin: 0;
  padding: 20px;
}

.title {
  color: #ffca28;
  font-weight: bold;
  font-size: 16px;
}

.cancel-btn {
  background-color: #e8b839;
  background: linear-gradient(
    90deg,
    rgba(232, 184, 57, 1) 0%,
    rgba(232, 184, 57, 1) 35%,
    rgba(186, 129, 21, 1) 63%,
    rgba(251, 246, 127, 1) 82%,
    rgba(220, 188, 78, 1) 100%
  );
  border: none !important;
  border: none;
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: bold;
  color: #00397f;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: background 0.3s;
}

.cancel-btn:hover {
  cursor: pointer;
}

.bet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 16px;
  justify-items: center;
}

.chip img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  transition: transform 0.2s;
  cursor: pointer;
}

.chip img:hover {
  transform: scale(1.1);
}

.cancel-btn:hover {
  background: #ffd54f;
}

.spin-overlay {
  z-index: 2000;
  position: fixed;
  top: 0;

  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive styles */

@media screen and (max-width: 1280px) {
  :deep(.card) {
    width: 60px !important;
    height: 90px !important;
  }
}

@media screen and (max-width: 768px) {
  .jackpot-text {
    top: 103%;
    right: 38%;
  }

  .jackpot-text img {
    width: 140px !important;
    height: 30px !important;
  }

  .game-container {
    background-size: contain;
  }

  .title {
    font-size: 14px;
  }

  .cancel-btn {
    padding: 3px 10px;
    font-size: 12px;
  }

  .leave-btn {
    font-size: 12px !important;
    width: 80px !important;
    height: 30px !important;
  }

  .chip-amount {
    width: 100px !important;
    height: 30px !important;
  }

  .chip-amount-text {
    font-size: 10px;
  }

  .jackpot-text-container {
    top: 110% !important;
  }
}

@media screen and (max-width: 800px) {
  .el-header,
  .el-footer {
    width: 90% !important;
  }

  .custom-drawer-header {
    width: 90% !important;
  }

  :deep(.el-drawer__body) {
    width: 100%;
  }

  .chip img {
    width: 60px;
    height: 60px;
  }

  .bet-grid {
    gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }

  .timer-container {
    width: 80px;
    height: 80px;
  }

  .timer {
    font-size: 46px;
  }

  .countdown-text,
  .countdown-number {
    font-size: 28px;
  }
}

@media screen and (max-width: 425px) {
  .el-header-image,
  .el-footer-image,
  .custom-drawer-header {
    padding: 0 15px !important;
  }

  .jackpot-container {
    width: 160px !important;
    height: 70px !important;
    background-size: contain !important;
    margin-top: 30px !important;
    margin-left: 10px;
  }

  .timer-container {
    width: 60px;
    height: 60px;
  }

  .timer {
    font-size: 36px;
  }

  .leave-btn {
    width: 50px !important;
    font-size: 10px !important;
    height: 20px !important;
  }

  .jackpot-amount {
    font-size: 1.5em;
  }

  .chip-amount {
    width: 80px !important;
    height: 30px !important;
  }

  .chip-amount-text {
    font-size: 8px !important;
  }

  .jackpot-text-container {
    top: 120% !important;
    right: 38%;
  }

  .jackpot-text {
    width: 96px;
  }
}
</style>
