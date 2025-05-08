<template>
  <div class="win-overlay" v-if="gameStore.getShowWinBanner">
    <div class="banner">
      <el-image fit="cover" :src="congratulations" class="congratulations" />
      <el-image fit="cover" :src="vfxLight" class="light-1" />
      <el-image fit="cover" :src="vfxLight" class="light-2" />
      <div class="text-container">
        <el-text class="text">+{{ Math.round(outputValue) }}</el-text>
      </div>
      <el-text class="close-text" @click="handleClose"> Click here to close </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGameStore } from '@/stores';
import { useTransition } from '@vueuse/core';
import vfxLight from '@/assets/game/vfx-light.png';
import congratulations from '@/assets/game/congratulations.png';

const gameStore = useGameStore();
const source = ref(0);
const outputValue = useTransition(source, { duration: 1000 });

const handleClose = () => {
  gameStore.setBetOnCard(0);
  gameStore.setWinBanner(false);
};

watch(
  () => gameStore.getBetOnCard,
  (newValue) => {
    source.value = newValue;
  },
);
</script>

<style scoped>
.win-overlay {
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

.banner {
  animation: popup 0.25s ease-in-out;
  width: 400px;
  height: 567px;
  background-image: url('@/assets/game/congrats-banner.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.congratulations {
  position: absolute;
  top: 7.5%;
}

.text-container {
  position: absolute;
  animation: popup 0.25s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text {
  font-size: 48px;
  color: #f9c80e;
}

.close-text {
  position: absolute;
  bottom: -0%;
  color: var(--primary-white);
  word-spacing: 4px;
  cursor: pointer;
}

.light-1 {
  animation: fade-in-out linear 2s infinite alternate;
}

.light-2 {
  position: absolute;
  transform: rotate(45deg);
  animation: fade-in-out-2 linear 2s infinite alternate;
}

@keyframes fade-in-out {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-in-out-2 {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

@keyframes popup {
  from {
    scale: 0;
  }

  to {
    scale: 1;
  }
}

@media screen and (max-width: 520px) {
  .banner {
    width: 300px;
    height: 425px;
  }

  .text {
    font-size: 36px;
  }
}
@media screen and (max-width: 420px) {
  .banner {
    width: 250px;
    height: 354px;
  }

  .text {
    font-size: 32px;
  }

  .close-text {
    bottom: -10%;
  }
}
</style>
