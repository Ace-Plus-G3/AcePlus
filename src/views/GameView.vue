<template>
  <el-container>
    <el-header>HEADER</el-header>

    <div style="position: fixed; z-index: 1000" v-if="game_status === 'WIN'" class="win-overlay">
      <el-image src="/game/title_win.png" />
    </div>

    <div v-if="startingIn === 0" class="timer-container">
      <div class="timer">{{ timer }}</div>
    </div>
    <div v-if="startingIn > 0" class="starting-countdown">
      <div class="countdown-text">Starting in:</div>
      <div class="countdown-number">{{ startingIn }}</div>
    </div>
    <SpinTheWheel />
    <el-main>
      <div class="game-container" ref="gameContainerRef" @click="drawer = true" :disabled="startGame === 'Start'">
        <el-image fit="cover" src="/game/card_back_bg.png" alt="card_back_bg" class="card" />
        <CustomCardView v-for="(_, index) in 4" :key="index" :index="index" :length="4" :start="startGame"
          :delay="index * 200" :reveal="reveal" @handle-select-card="handleSelectCard" :selected-card="selectedCard"
          :four-cards="FourCards" :container-width="containerWidth" :container-height="containerHeight" />
      </div>

      <!-- <div>
        <el-button  :disabled="startGame === 'Start'" class="start-btn">
          <img draggable="false" src="/game/game_bet.png" alt="game_bet" fit="cover" class="game-start" />
        </el-button>
      </div> -->


      <el-drawer direction="btt" @close="drawer = false" v-model="drawer" :with-header="false"
        custom-class="custom-drawer">
        <div class="custom-drawer-header">
          <span class="title">Place your bets !</span>
          <button class="cancel-btn" @click="handleCancel">Cancel</button>
        </div>
        <div class="drawer-content">
          <div class="bet-grid">
            <div v-for="chip in chips" :key="chip.value" class="chip">
              <img :src="chip.image" :alt="chip.value" />
            </div>
          </div>
        </div>
      </el-drawer>
    </el-main>
    <el-footer>FOOTER</el-footer>
  </el-container>
</template>

<script setup lang="ts">
import SpinTheWheel from '@/components/SpinTheWheel.vue'
import CustomCardView from '@/components/CustomCardView.vue'
import { Cards } from '@/models/constants'
import type { TCardType } from '@/models/type'
import { onMounted, ref, watch, onBeforeUnmount, nextTick, onUnmounted } from 'vue'

const drawer = ref(false)

const gameContainerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const containerHeight = ref(0)

let intervalId: number | undefined = undefined
const timer = ref(10)
const startingIn = ref(5)
const reveal = ref(false)
const startGame = ref<'Start' | 'Pending' | 'Done'>('Pending')
const game_status = ref<'WIN' | 'LOSE' | 'PENDING'>('PENDING')

const FourCards = ref<TCardType[]>([])
const selectedCard = ref<TCardType[]>([])

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
  startGame.value = 'Done'
  timer.value = 3
  reveal.value = false
  handleSelectCard(null)
  game_status.value = 'PENDING'
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
  FourCards.value = Cards.slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((card) => ({
      ...card,
      playerCount: 0,
    }))
}

const handleSelectCard = (index: number | null) => {
  if (index === null) {
    selectedCard.value = []
    return
  }

  const foundCard = FourCards.value[index]
  const isAlreadySelected = selectedCard.value.some((card) => card.value === foundCard.value)

  if (isAlreadySelected) {
    // Unselect
    selectedCard.value = selectedCard.value.filter((card) => card.value !== foundCard.value)
    FourCards.value[index].playerCount -= 1
  } else {
    // Select
    selectedCard.value.push(foundCard)
    FourCards.value[index].playerCount += 1
  }
}

// Handle window resize
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
  drawer.value = false;
  selectedCard.value = [];
};

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
      reveal.value = true
      getHighestCard()
    }, 10500)

    // Reset after reveal
    setTimeout(() => {
      handleResetCard()
    }, 12000)
  }
})
shuffleCard()


const chips = [
  { value: '1', image: new URL('@/assets/1PESO.png', import.meta.url).href },
  { value: '5', image: new URL('@/assets/5PESO.png', import.meta.url).href },
  { value: '10', image: new URL('@/assets/10PESO.png', import.meta.url).href },
  { value: '50', image: new URL('@/assets/50PESO.png', import.meta.url).href },
  { value: '100', image: new URL('@/assets/100PESO.png', import.meta.url).href },
  { value: '500', image: new URL('@/assets/500PESO.png', import.meta.url).href },
  { value: '1K', image: new URL('@/assets/1KPESO.png', import.meta.url).href },
  { value: '5K', image: new URL('@/assets/5KPESO.png', import.meta.url).href },
  { value: '10K', image: new URL('@/assets/10KPESO.png', import.meta.url).href },
];
</script>

<style scoped>
/* .el-drawer {
  width: 40%;
} */

.drawer-content {
  margin-top: 60px;
  padding: 20px;
}

.bet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 16px;
  justify-items: center;
}

.chip img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  transition: transform 0.2s;
  cursor: pointer;
}

.chip img:hover {
  transform: scale(1.1);
}

:deep(.el-drawer) {
  width: 40% !important;
  left: 30% !important;
  right: 0;
  height: 40% !important;
  background: linear-gradient(to bottom, #1e1e3f, #0c0c1c);
  border-radius: 10px 15px 0px 0px;
  overflow: hidden;
}

/* Custom header */
.custom-drawer-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: linear-gradient(to right, #002c71, #00397f);
  clip-path: polygon(10px 0%, calc(100% - 10px) 0%, 100% 100%, 0% 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 2;
}

/* Header text */
.custom-drawer-header .title {
  color: #ffca28;
  font-weight: bold;
  font-size: 16px;
}

/* Cancel button */
.custom-drawer-header .cancel-btn {
  background: #ffca28;
  border: none;
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: bold;
  color: #00397f;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: background 0.3s;
}

.custom-drawer-header .cancel-btn:hover {
  background: #ffd54f;
}

.el-container {
  height: 100vh;
  background-image: url(../assets/homepage_bg.png);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 67px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 0;
  margin: 0;
}

.el-header {
  max-width: 800px;
  min-width: 320px;
  width: 100%;
  background: slateblue;
}

.el-main {
  max-width: 800px;
  min-width: 320px;
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.el-footer {
  max-width: 800px;
  min-width: 320px;
  width: 100%;
  background: green;
}

.game-container {
  width: 100%;
  height: 400px;
  background-image: url('/game/game_table.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  margin: 0;
  padding: 0;
}

.start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  border-radius: 100%;
  padding: 0;
}

.start-btn:active {
  cursor: pointer;
  scale: 1.1;
  transition: all 0.3s;
}

.timer-container {
  background: white;
  border: 5px solid black;
  border-radius: 100%;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.timer {
  color: black;
  font-size: 56px;
}

.starting-countdown {
  height: 100px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.countdown-text {
  color: white;
  font-size: 32px;
}

.countdown-number {
  color: white;
  font-size: 32px;
}

.win-overlay {
  animation: popup 0.5s ease-in-out;
}

.card {
  width: 80px;
  height: 120px;
  z-index: 1;
  transform: translate(10px, 10px);
}

@keyframes popup {
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media screen and (max-width: 1360px) {
  .card {
    width: 60px;
    height: 90px;
  }
}

@media screen and (max-width: 720px) {
  .game-container {
    background-size: 110% 75%;
  }
}
</style>
