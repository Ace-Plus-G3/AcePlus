<template>
  <el-container>
    <el-header>HEADER</el-header>
    <el-main>
      <el-text class="timer" style="color: black; font-size: 72px">{{ timer }}</el-text>

      <div class="game-container" style="position: relative">
        <el-image src="/game/card_back_bg.png" alt="card_back" />
        <CustomCardView
          v-for="(_, index) in 4"
          :length="4"
          :key="index"
          :index="index"
          :start="startGame"
          :delay="index * 200"
          :reveal="reveal"
          @handle-select-card="handleSelectCard"
          :selectedCard="selectedCard"
        />
        <el-image
          src="/game/game_table.png"
          alt="game-table"
          fit="cover"
          style="width: 100%; height: 460px"
        />
      </div>

      <div>
        <img
          @click="handleAnimation"
          :disabled="true"
          draggable="false"
          src="/game/game_bet.png"
          alt="game_bet"
          fit="cover"
          style="width: 100px; height: 100px; margin-top: 4em"
          class="game-start"
        />
        <!-- <img
          v-else
          @click="handleResetCard"
          draggable="false"
          src="/game/game_again.png"
          alt="game_again"
          fit="cover"
          style="width: 100px; height: 100px; margin-top: 4em"
          class="game-start"
        /> -->
      </div>
    </el-main>
    <el-footer>FOOTER</el-footer>
  </el-container>
</template>

<script setup lang="ts">
import CustomCardView from '@/components/CustomCardView.vue'
import { ref, watch } from 'vue'

let intervalId: number | undefined = undefined

const startGame = ref<'Start' | 'Pending' | 'Done'>('Pending')
const timer = ref(10)
const reveal = ref(false)
const selectedCard = ref<number | null>(null)

const handleAnimation = () => {
  startGame.value = 'Start'
}

const handleResetCard = () => {
  startGame.value = 'Done'
  timer.value = 10
  reveal.value = false

  // Clear the interval when resetting
  if (intervalId !== undefined) {
    clearInterval(intervalId)
    intervalId = undefined
  }
}

const handleSelectCard = (index: number) => {
  console.log(index)
}

watch(
  () => startGame.value,
  () => {
    if (startGame.value === 'Start') {
      if (intervalId !== undefined) {
        clearInterval(intervalId)
      }

      // 10 seconds countdown
      intervalId = setInterval(() => {
        if (timer.value > 0) {
          timer.value--
        } else {
          clearInterval(intervalId)
          intervalId = undefined
        }
      }, 1000)

      // After 10 secs, reveal
      setTimeout(() => {
        reveal.value = true
      }, 10000)

      // After 15 secs, Brings back the displayed cards.
      setTimeout(() => {
        handleResetCard()
      }, 15000)
    }
  },
)
</script>

<style scoped>
.el-container {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: url('/game/game_bg.jpg');
  background-position: center;
  background-size: cover;
}

.el-header {
  width: 1000px;
  background: red;
}
.el-main {
  width: 1000px;
  /* background: blue; */

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.game-start:active {
  cursor: pointer;
  scale: 1.1;
  animation-duration: 300ms;
  transition-duration: all 0.3ms;
}

.timer {
  width: 100px;
  height: 100px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 5px solid black;
}

.el-footer {
  width: 1000px;
  background: green;
}
</style>
