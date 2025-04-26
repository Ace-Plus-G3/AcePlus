<template>
  <el-container>
    <HeaderView />

    <!-- Start of Overlays -->
    <PlayerWins />
    <GameTimer />
    <StartingInView />
    <div class="spin-overlay" v-if="useGameStore().getSpinTheWheel">
      <SpinTheWheel />
    </div>
    <!-- End of Overlays -->

    <el-main>
      <div
        class="game-container"
        ref="gameContainerRef"
        :disabled="useGameStore().getStartGame === 'START'"
      >
        <el-image fit="cover" :src="cardBack" alt="card_back_bg" class="card" />
        <BetWin
          v-for="(item, index) in useGameStore().getAllBets"
          :key="item"
          :bet="item"
          :index="index"
        />
        <CustomCard
          v-for="(card, index) in useGameStore().getFourCards"
          :key="index"
          :index="index"
          :card="card"
          :container-height="containerHeight"
          :container-width="containerWidth"
        />
      </div>
    </el-main>

    <FooterView />
    <BetDrawer />
  </el-container>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import HeaderView from '@/components/game/HeaderView.vue'
import CustomCard from '@/components/game/CustomCard.vue'
import { useGameStore } from '@/stores'

// images
import cardBack from '@/assets/cards/back/card_back_bg.png'
import FooterView from '@/components/game/FooterView.vue'
import gameLogic from '@/composables/useGameLogic'
import SpinTheWheel from '@/components/SpinTheWheel.vue'
import BetDrawer from '@/components/game/BetDrawer.vue'
import PlayerWins from '@/components/overlays/PlayerWins.vue'

const gameContainerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const containerHeight = ref(0)

const updateContainerDimensions = async () => {
  await nextTick()
  if (gameContainerRef.value) {
    const rect = gameContainerRef.value.getBoundingClientRect()
    containerWidth.value = rect.width
    containerHeight.value = rect.height
  }
}

const cleanupAllTimers = () => {
  gameLogic.cleanupAllIntervals()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateContainerDimensions)
  gameLogic.cleanupAll()
})

onUnmounted(() => {
  gameLogic.resetGameState()
})

onMounted(async () => {
  window.addEventListener('resize', updateContainerDimensions)
  await nextTick()
  await updateContainerDimensions()

  // Clean up any existing timers before initializing the game
  cleanupAllTimers()
  gameLogic.initializeGame()
})

watch(
  () => useGameStore().getStartGame,
  (newValue) => {
    if (newValue === 'START') {
      gameLogic.cleanupAllIntervals()

      const newGameTimeoutId = setTimeout(() => {
        gameLogic.handleGenerateBots()

        const newIntervalId = setInterval(() => {
          if (useGameStore().getTimer > 0) {
            useGameStore().decreaseTimer()
          } else {
            gameLogic.setIntervalId(undefined)
          }
        }, 1000)

        gameLogic.setIntervalId(newIntervalId)
      }, 500)
      gameLogic.addTimeout(newGameTimeoutId)

      const distributeBotTimeout = setTimeout(() => {
        // console.log('DISTRIBUTE!')
        gameLogic.handleDistributeBot()
      }, 1500)
      gameLogic.addTimeout(distributeBotTimeout)

      const resetGameTImeout = setTimeout(() => {
        // console.log('10 secs done')
        gameLogic.handleCancelBet()
        gameLogic.getHighestCard()
        gameLogic.handleRevealCard()
      }, 10500)
      gameLogic.addTimeout(resetGameTImeout)

      const resetCardTimeout = setTimeout(() => {
        gameLogic.handleResetCard()
      }, 12000)
      gameLogic.addTimeout(resetCardTimeout)
    }
  },
)
</script>

<style scoped>
.el-container {
  position: relative;
  height: 100dvh;
  /* background-image: url('@/assets/homepage_bg.png'); */
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

.spin-overlay {
  z-index: 2000;
  position: fixed;
  top: 0;

  width: 100%;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 780px) {
  :deep(.card) {
    width: 60px !important;
    height: 90px !important;
  }
}

/* Drawer Styles*/

:deep(.el-drawer) {
  height: 50% !important;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

:deep(.el-drawer__body) {
  padding: 0;
  margin: 0;
  max-width: 800px;
  min-width: 375px;
  width: 100% !important;
  height: 100% !important;
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
/* Drawer Styles*/
:deep(.el-overlay) {
  overflow: hidden !important;
  display: flex;
  justify-content: center;
}

:deep(.el-drawer) {
  overflow: hidden;
  background: none;
  height: 50% !important;

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
</style>
