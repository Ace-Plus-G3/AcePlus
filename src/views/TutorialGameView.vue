<template>
  <el-container>
    <HeaderViewStatic />

    <el-main>
      <div
        class="game-container"
        ref="gameContainerRef"
        :disabled="gameStore.getStartGame === 'START'"
      >
        <el-image id="card-back" fit="cover" :src="cardBack" alt="card_back_bg" class="card" />
        <CustomCardStatic
          id="custom-card"
          v-for="(card, index) in gameStore.getFourCards"
          :key="index"
          :index="index"
          :card="card"
          :container-height="containerHeight"
          :container-width="containerWidth"
        />
      </div>
    </el-main>

    <FooterViewStatic />
    <BetDrawerStatic />
    <TutorialComponent :isOpen="isTutorialOpen" />
  </el-container>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import HeaderViewStatic from '@/components/static/HeaderViewStatic.vue'
import CustomCardStatic from '@/components/static/CustomCardStatic.vue'
import { useGameStore } from '@/stores'

// images
import cardBack from '@/assets/cards/back/card_back_bg.png'
import FooterViewStatic from '@/components/static/FooterViewStatic.vue'
import gameLogic from '@/composables/useGameLogic'
import BetDrawerStatic from '@/components/static/BetDrawerStatic.vue'
import TutorialComponent from '@/components/TutorialComponent.vue'
import { useRoute } from 'vue-router'

const gameContainerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const containerHeight = ref(0)

const gameStore = useGameStore()

const updateContainerDimensions = async () => {
  await nextTick()
  if (gameContainerRef.value) {
    const rect = gameContainerRef.value.getBoundingClientRect()
    containerWidth.value = rect.width
    containerHeight.value = rect.height
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateContainerDimensions)
  gameLogic.cleanupAll()
})

const route = useRoute()
const isTutorialOpen = ref(false)

onMounted(() => {
  isTutorialOpen.value = route.query.tutorial === 'true'
})

onMounted(async () => {
  window.addEventListener('resize', updateContainerDimensions)
  await nextTick()
  await updateContainerDimensions()

  gameLogic.initializeGame()
})
</script>

<style scoped>
.el-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100dvh;
  background-image: url('@/assets/homepage_bg.png');
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
  background-color: inherit;
  overflow: hidden !important;
  display: flex;
  justify-content: center;
}

:deep(.el-drawer) {
  overflow: hidden;
  background: none;
  height: 33% !important;

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
