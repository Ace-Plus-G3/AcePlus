<template>
  <el-container>
    <el-header>
      <div class="el-header-top-bar">
        <div class="el-header-image"></div>
      </div>
    </el-header>

    <!-- Start of Overlays -->
    <PlayerWins :game_status="game_status" />
    <GameTimer :starting-in="startingIn" :timer="timer" />
    <StartingInView :starting-in="startingIn" />
    <!-- End of Overlays -->

    <el-main>
      <div class="game-container" ref="gameContainerRef" :disabled="startGame === 'Start'">
        <el-image fit="cover" :src="cardBack" alt="card_back_bg" class="card" />
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

      <div v-if="selectedCard.length > 0 && selectedCard[0].value === 1">
        <SpinTheWheel />
      </div>

      <!-- <div>
        <el-button  :disabled="startGame === 'Start'" class="start-btn">
          <img draggable="false" src="/game/game_bet.png" alt="game_bet" fit="cover" class="game-start" />
        </el-button>
      </div> -->
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
import type { TCardType, TSelectedCard } from '@/models/type'
import { onMounted, ref, watch, onBeforeUnmount, nextTick, onUnmounted } from 'vue'

import cardBack from '@/assets/cards/back/card_back_bg.png'
import PlayerWins from '@/components/overlays/PlayerWins.vue'
import StartingInView from '@/components/overlays/StartingInView.vue'
import GameTimer from '@/components/overlays/GameTimer.vue'
import { getRandomCards } from '@/utils/getRandomCards'

const gameContainerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const containerHeight = ref(0)

let intervalId: number | undefined = undefined
const timer = ref(10)
const startingIn = ref(5)

const drawer = ref(false)
const reveal = ref(false)

const startGame = ref<'Start' | 'Pending' | 'Done'>('Pending')
const game_status = ref<'WIN' | 'LOSE' | 'PENDING'>('PENDING')

const FourCards = ref<TCardType[]>([])
const selectedCard = ref<TSelectedCard[]>([])

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
  // drawer.value = false
  startGame.value = 'Done'
  game_status.value = 'PENDING'

  selectedCard.value = []
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
  FourCards.value = getRandomCards(Cards).map((card) => ({
    ...card,
    playerCount: 0,
  }))

  // FourCards.value.forEach((item) => {
  //   console.log(`${item.value},${item.playerCount}`)
  // })
}

const handleSelectCard = (index: number | null) => {
  if (index === null) {
    selectedCard.value = []
    return
  }

  if (reveal.value) return

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

  const isAlreadySelected = selectedCard.value.some(
    (card) => card.value === currentSelectedCard.value?.card.value,
  )

  if (isAlreadySelected) {
    // Change bet of the selected card
    const updatedSelectedCard = selectedCard.value.map((item) =>
      item.value === currentSelectedCard.value?.card.value
        ? {
            ...currentSelectedCard.value.card,
            betAmount: betValue,
          }
        : item,
    )
    selectedCard.value = updatedSelectedCard
    // FourCards.value[index].playerCount -= 1
  } else {
    // Bet
    selectedCard.value.push({
      ...currentSelectedCard.value.card,
      betAmount: betValue,
    })
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

const cleanupIntervals = () => {
  if (intervalId !== undefined) {
    clearInterval(intervalId)
    intervalId = undefined
  }
}

const handleCancel = () => {
  drawer.value = false
  currentSelectedCard.value = null
  // selectedCard.value = []
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)

  await nextTick()

  await updateContainerDimensions()

  initializeGame()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  cleanupIntervals()
})

onUnmounted(() => {
  cleanupIntervals()
})

watch(startGame, (newValue) => {
  if (newValue === 'Start') {
    cleanupIntervals()

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

    // After timer completes, reveal cards
    setTimeout(() => {
      handleCancel()
      reveal.value = true
      getHighestCard()
    }, 10500)

    // Reset after reveal
    setTimeout(() => {
      handleResetCard()
    }, 12000)
  }
})
</script>

<style scoped>
.card {
  z-index: 1 !important;
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

/* Responsive styles */

@media screen and (max-width: 1280px) {
  :deep(.card) {
    width: 60px !important;
    height: 90px !important;
  }
}

@media screen and (max-width: 720px) {
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

@media screen and (max-width: 400px) {
  .el-header-image,
  .el-footer-image,
  .custom-drawer-header {
    padding: 0 20px;
  }

  .timer-container {
    width: 60px;
    height: 60px;
  }

  .timer {
    font-size: 36px;
  }
}
</style>
