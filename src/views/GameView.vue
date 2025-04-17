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
      <div style="position: fixed; z-index: 1000" v-if="game_status === 'WIN'" class="win-overlay">
        <el-image src="/game/title_win.png" />
      </div>

      <el-text v-if="startingIn === 0" class="timer" style="color: black; font-size: 56px">{{
        timer
      }}</el-text>

      <div
        v-if="startingIn > 0"
        style="
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        "
      >
        <el-text style="color: white; font-size: 32px" size="large">Starting in:</el-text>
        <el-text style="color: white; font-size: 32px" size="large">{{ startingIn }}</el-text>
      </div>

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
            :selected-card="selectedCard"
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
        <el-button :disabled="startGame === 'Start'" class="start-btn">
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
import { onMounted, ref, watch } from 'vue'

let intervalId: number | undefined = undefined
const timer = ref(10)
const startingIn = ref(5)
const reveal = ref(false)
const startGame = ref<'Start' | 'Pending' | 'Done'>('Pending')
const game_status = ref<'WIN' | 'LOSE' | 'PENDING'>('PENDING')

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
  setTimeout(() => {
    if (selectedCard.value?.value === 1) {
      game_status.value = 'WIN'
      console.log('You win!')
    } else if (selectedCard.value?.value === highestCard.value) {
      game_status.value = 'WIN'
      console.log('You win!')
    } else {
      game_status.value = 'LOSE'
      console.log('You lose!')
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
    startGame.value = 'Start'
  }, 4000)
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
    selectedCard.value = null
    console.log('Selected card cleared')
    return
  }

  const foundCard = FourCards.value[index]

  if (!foundCard) {
    console.warn('No card found at index:', index)
    return
  }

  selectedCard.value = selectedCard.value?.value === foundCard.value ? null : foundCard

  console.log('Selected card:', selectedCard.value)
}

onMounted(() => {
  if (intervalId !== undefined) {
    clearInterval(intervalId)
  }

  // 10 seconds countdown
  intervalId = setInterval(() => {
    if (startingIn.value > 0) {
      startingIn.value--
    } else {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }, 1000)

  setTimeout(() => {
    startGame.value = 'Start'
  }, 5000)
})

watch(startGame, () => {
  if (startGame.value === 'Start') {
    if (intervalId !== undefined) {
      clearInterval(intervalId)
    }
    setTimeout(() => {
      intervalId = setInterval(() => {
        if (timer.value > 0) {
          timer.value--
        } else {
          clearInterval(intervalId)
          intervalId = undefined
        }
      }, 1000) // 10 seconds countdown
    }, 500) // 0.5 seconds delay before the countdown

    setTimeout(() => {
      reveal.value = true
      getHighestCard()
    }, 10500) // After 10.5 secs, reveal (0.5 seconds for delay)

    // After 12 secs, Brings back the displayed cards.
    setTimeout(() => {
      handleResetCard()
    }, 12000)
  }
})

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

.game-status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 1000;
}

.game-status-text {
  color: white;
  font-size: 40px;

  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.win {
  background: #e7bb68;
}

.lose {
  background: #7d1f22;
}

.win-overlay {
  animation: popup 0.5s ease-in-out;
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
</style>
