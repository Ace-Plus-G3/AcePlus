<template>
  <el-container>
    <HeaderView />

    <!-- Start of Overlays -->
    <PlayerWins :game_status="game_status" />
    <GameTimer :starting-in="startingIn" :timer="timer" />
    <StartingInView :starting-in="startingIn" />
    <!-- <div class="spin-overlay" v-if="showSpinTheWheel">
      <SpinTheWheel @handle-close="handleCloseWheel" :bet-amount="betOnAce" />
    </div> -->
    <!-- End of Overlays -->

    <el-main>
      <div class="game-container" ref="gameContainerRef" :disabled="startGame === 'Start'">
        <CustomCard
          v-for="(card, index) in FourCards"
          :key="index"
          :start="startGame"
          :index="index"
          :four-cards="FourCards"
          :card="card"
          :container-height="containerHeight"
          :container-width="containerWidth"
          :reveal="reveal"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import HeaderView from '@/components/game/HeaderView.vue'
import type { TCardType } from '@/models/type'
import CustomCard from '@/components/game/CustomCard.vue'
import { getRandomCards } from '@/utils/getRandomCards'
import { Cards } from '@/models/constants'
import PlayerWins from '@/components/overlays/PlayerWins.vue'
import GameTimer from '@/components/overlays/GameTimer.vue'
import StartingInView from '@/components/overlays/StartingInView.vue'

let intervalId: number | undefined = undefined
const timer = ref(3)
const startingIn = ref(2)

const gameContainerRef = ref<HTMLElement | null>(null)

const FourCards = ref<TCardType[]>([])
const startGame = ref<'Start' | 'Pending' | 'Done'>('Pending')
const game_status = ref<'WIN' | 'LOSE' | 'PENDING'>('PENDING')

const containerWidth = ref(0)
const containerHeight = ref(0)

const reveal = ref(false)

const updateContainerDimensions = async () => {
  await nextTick()
  if (gameContainerRef.value) {
    const rect = gameContainerRef.value.getBoundingClientRect()
    containerWidth.value = rect.width
    containerHeight.value = rect.height
  }
}

const initializeGame = async () => {
  await updateContainerDimensions()

  FourCards.value = getRandomCards(Cards)

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

onMounted(async () => {
  window.addEventListener('resize', updateContainerDimensions)

  await nextTick()

  await updateContainerDimensions()

  initializeGame()
})

watch(startGame, (newValue) => {
  if (newValue === 'Start') {
    if (intervalId !== undefined) {
      clearInterval(intervalId)
      intervalId = undefined
    }

    setTimeout(() => {
      // handleGenerateBots()
      // handleDistributeBot()
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
      // handleCancel()
      // getHighestCard()
      // handleRevealCard()
    }, 10500)

    // Reset after reveal
    setTimeout(() => {
      // handleResetCard()
    }, 12000)
  }
})
</script>

<style scoped>
.el-container {
  height: 100dvh;
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
</style>
