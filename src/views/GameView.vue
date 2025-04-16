<template>
  <el-container>
    <el-header>HEADER</el-header>
    <el-main style="padding: 0; position: relative">
      <!-- <div class="overlay">
        <video class="card-video" autoplay loop muted playsinline>
          <source src="/new-loading.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div> -->
      <el-text class="timer" style="color: black; font-size: 56px">{{ timer }}</el-text>

      <div ref="cardContainer" class="game-container" style="position: relative">
        <div style="display: flex; align-items: center; justify-content: start; width: 100%">
          <el-image
            fit="cover"
            src="/game/card_back_bg.png"
            alt="card_back"
            style="width: 80px; height: 120px; z-index: 20"
          />
          <CustomCardView
            v-for="(_, index) in 4"
            :length="4"
            :key="index"
            :index="index"
            :start="startGame"
            :delay="index * 200"
            :reveal="reveal"
            @handle-select-card="handleSelectCard"
            :selected-card="index"
            :four-cards="FourCards"
          />
        </div>
        <el-image
          src="/game/game_table.png"
          alt="game-table"
          fit="cover"
          style="width: 100%; height: 400px"
        />
      </div>

      <div>
        <el-button :disabled="startGame === 'Start'" @click="handleStart" class="start-btn">
          <img
            draggable="false"
            src="/game/game_bet.png"
            alt="game_bet"
            fit="cover"
            class="game-start"
          />
        </el-button>
      </div>
    </el-main>
    <el-footer>FOOTER</el-footer>
  </el-container>
</template>

<script setup lang="ts">
import CustomCardView from '@/components/CustomCardView.vue'
import { Cards } from '@/models/constants'
import type { TCardType } from '@/models/type'
import { nextTick, ref, watch } from 'vue'

let intervalId: number | undefined = undefined
const timer = ref(10)
const reveal = ref(false)
const startGame = ref<'Start' | 'Pending' | 'Done'>('Pending')

const FourCards = ref<TCardType[]>([])
const selectedCard = ref<TCardType | null>(null)

const getHighestCard = () => {
  if (FourCards.value.length === 0) {
    console.warn('No cards to evaluate!')
    return null // Handle empty array
  }

  const highestCard = FourCards.value.reduce((maxCard, currentCard) => {
    return currentCard.value > maxCard.value ? currentCard : maxCard
  })

  console.log('Highest Card:', highestCard)
  if (selectedCard.value?.value === highestCard.value || selectedCard.value?.value === 1) {
    console.log('You win!')
  } else {
    console.log('You lose!')
  }
  return highestCard
}

const handleStart = async () => {
  startGame.value = 'Start'
  shuffleCard()
  console.log(FourCards.value)
  await nextTick()
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

const shuffleCard = () => {
  FourCards.value = Cards.slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
  console.log('Shuffle!')
}

const handleSelectCard = (index: number | null) => {
  console.log('Index clicked:', index)

  if (index === null) {
    selectedCard.value = null // Clear selection if no index is provided
    console.log('Selected card cleared')
    return
  }

  const foundCard = FourCards.value[index] // Find the card at the given index

  if (!foundCard) {
    console.warn('No card found at index:', index)
    return // Exit if no card is found
  }

  // Toggle selection
  selectedCard.value = selectedCard.value?.value === foundCard.value ? null : foundCard

  console.log('Selected card:', selectedCard.value)
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
        getHighestCard()
      }, 10000)

      // After 13 secs, Brings back the displayed cards.
      setTimeout(() => {
        handleResetCard()
        handleSelectCard(null)
      }, 12000)
    }
  },
)

shuffleCard()
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
  width: 800px;
  background: slateblue;
}
.el-main {
  width: 800px;
  /* background: blue; */

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  animation-duration: 300ms;
  transition-duration: all 0.3ms;
}

.game-container {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer {
  width: 80px;
  height: 80px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 5px solid black;
}

.el-footer {
  width: 800px;
  background: green;
}
.overlay {
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1990;
}
.card-video {
  width: 800;
  height: 800px;
}
</style>
