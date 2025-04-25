<template>
  <el-container>
    <HeaderView />

    <!-- Start of Overlays -->
    <!-- <PlayerWins :game_status="game_status" /> -->
    <GameTimer />
    <StartingInView />
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
import { nextTick, onMounted, ref, watch } from 'vue'
import HeaderView from '@/components/game/HeaderView.vue'
import CustomCard from '@/components/game/CustomCard.vue'
import { useGameStore } from '@/stores'

// images
import cardBack from '@/assets/cards/back/card_back_bg.png'
import FooterView from '@/components/game/FooterView.vue'
import BetDrawer from '@/components/game/BetDrawer.vue'

let intervalId: number | undefined = undefined
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

// const initializeGame = async () => {
//   await updateContainerDimensions()

//   FourCards.value = getRandomCards(Cards)

//   // Initial game state
//   startGame.value = 'PENDING'

//   if (intervalId !== undefined) {
//     clearInterval(intervalId)
//   }

//   intervalId = setInterval(() => {
//     if (startingIn.value > 0) {
//       startingIn.value--
//     } else {
//       clearInterval(intervalId)
//       intervalId = undefined

//       updateContainerDimensions().then(() => {
//         setTimeout(() => {
//           startGame.value = 'START'
//         }, 200)
//       })
//     }
//   }, 1000)
// }

onMounted(async () => {
  window.addEventListener('resize', updateContainerDimensions)

  await nextTick()

  await updateContainerDimensions()

  useGameStore().initializeGame()
})

watch(
  () => useGameStore().getStartGame,
  (newValue) => {
    if (newValue === 'START') {
      if (intervalId !== undefined) {
        clearInterval(intervalId)
        intervalId = undefined
      }

      setTimeout(() => {
        // handleGenerateBots()
        // handleDistributeBot()
        intervalId = setInterval(() => {
          if (useGameStore().getTimer > 0) {
            useGameStore().decreaseTimer()
          } else {
            clearInterval(intervalId)
            intervalId = undefined
          }
        }, 1000)
      }, 500)

      // After timer completes, reveal cards
      setTimeout(() => {
        // useGameStore().handleCancelBet()
        useGameStore().getHighestCard()
        useGameStore().handleRevealCard()
      }, 10500)

      // Reset after reveal
      setTimeout(() => {
        useGameStore().handleResetCard()
      }, 12000)
    }
  },
)
</script>

<style scoped>
.el-container {
  position: relative;
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
