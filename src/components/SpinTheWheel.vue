<template>
  <div v-if="!showResult" class="wheel-container" @click="handleSpin">
    <img
      draggable="false"
      :src="Wheel"
      class="wheel"
      :style="{ transform: `rotate(${rotation}deg)` }"
    />
    <img draggable="false" :src="WheelArrow" class="wheel-arrow" />
    <img draggable="false" src="../assets/feet_wheel.png" class="wheel-bg" />
  </div>
  <div class="win-overlay" v-if="showResult">
    <div class="banner">
      <el-image fit="cover" :src="congratulations" class="congratulations" />
      <el-image fit="cover" :src="vfxLight" class="light-1" />
      <el-image fit="cover" :src="vfxLight" class="light-2" />
      <div class="text-container">
        <el-image :src="multiplierWin?.url" class="" />
        <el-text class="text">+{{ Math.round(outputValue) }}</el-text>
      </div>
      <el-text class="close-text" @click="handleClose"> Click here to close </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { probabilityRate, wheelDeg, WIN_TAX_RATE } from '@/models/constants';
import type { TSpinWheel } from '@/models/type';
import { useCreditStore, useGameStore } from '@/stores';
import { useTransition } from '@vueuse/core';
import spinSound from '@/assets/audio/sample6_wheel.mp3';
import winSound from '@/assets/audio/sample1_spin_price.mp3';
import { formatCurrency } from '@/utils/convertMoney';
import gameLogic from '@/composables/useGameLogic';
import { v4 as uuidv4 } from 'uuid';

// images
import Wheel from '@/assets/default_wheel.png';
import WheelArrow from '@/assets/wheel_arrow.png';
import vfxLight from '@/assets/game/vfx-light.png';
import congratulations from '@/assets/game/congratulations.png';

const gameStore = useGameStore();
const creditStore = useCreditStore();

const rotation = ref(0);
const isSpinning = ref(false);
const multiplierWin = ref<TSpinWheel | null>(null);
const showResult = ref(false);
const autoSpinTimeout = ref<number | null>(null);
const selectedSlice = ref<TSpinWheel | null>(null);
const source = ref(0);
const outputValue = useTransition(source, { duration: 3000 });

const spinAudio = new Audio(spinSound);
const winAudio = new Audio(winSound);

const cleanup = () => {
  if (autoSpinTimeout.value) {
    clearTimeout(autoSpinTimeout.value);
    autoSpinTimeout.value = null;
  }
  spinAudio.pause();
  spinAudio.currentTime = 0;
  winAudio.pause();
  winAudio.currentTime = 0;
};

const spinWheel = () => {
  if (isSpinning.value) return;

  // Reset in case we're respinning
  showResult.value = false;
  multiplierWin.value = null;
  isSpinning.value = true;

  // Play the spin sound
  spinAudio.volume = gameStore.getMusicWheel / 100;
  spinAudio.loop = false;
  spinAudio.currentTime = 0;
  spinAudio.play();

  const fullRotations = 360 * 10;

  // Randomly determine if "bokya" or "bonus" should appear
  const randomValue = Math.random();

  if (randomValue < probabilityRate.bokyaRate) {
    // nth chance of "bokya" appearing
    selectedSlice.value = wheelDeg.find((slice) => slice.multiplier === 1) || wheelDeg[7];
  } else if (randomValue >= probabilityRate.bokyaRate && randomValue < probabilityRate.BonusRate) {
    // nth chance of "bonus" appearing
    selectedSlice.value = wheelDeg.find((slice) => slice.multiplier === 6) || wheelDeg[3];
  } else {
    // For other outcomes
    const nonBokyaOrBonusSlices = wheelDeg.filter(
      (slice) => slice.multiplier > 1 && slice.multiplier !== 6,
    );
    const randomIndex = Math.floor(Math.random() * nonBokyaOrBonusSlices.length);
    selectedSlice.value = nonBokyaOrBonusSlices[randomIndex];
  }

  const stopAtDegree = fullRotations - selectedSlice.value.deg;
  rotation.value = stopAtDegree;

  const spinWheelTimeout = setTimeout(() => {
    spinAudio.pause();
    spinAudio.currentTime = 0;

    isSpinning.value = false;
    multiplierWin.value = selectedSlice.value;

    if (multiplierWin.value && multiplierWin.value.multiplier === 6) {
      // 6 is bonus wheel
      gameStore.setShowJackpotSpinTheWheel(true);
      gameStore.setShowSpinTheWheel(false);
    } else {
      showResult.value = true;

      if (selectedSlice.value && selectedSlice.value.multiplier > 1) {
        winAudio.currentTime = 0;
        winAudio.volume = gameStore.getWinMusic / 100;
        winAudio.play();

        // Update user's balance
        if (multiplierWin.value) {
          const grossWin = gameStore.getBetOnAce * multiplierWin.value.multiplier;
          const taxAmount = grossWin * WIN_TAX_RATE;
          const netWin = grossWin - taxAmount;

          console.log(`BetOnAce: ${gameStore.getBetOnAce}`);
          console.log(`grossWin: ${grossWin}`);
          console.log(`taxAmount: ${taxAmount}`);
          console.log(`NetWin: ${netWin}`);

          creditStore.setCurrentBalance(creditStore.getCurrentBalance + netWin);
          gameStore.setGameHistory({
            amount: netWin,
            betValue: gameStore.getBetOnAce,
            date: new Date(),
            type: 'WIN',
            wallet: `${formatCurrency(creditStore.getCurrentBalance)}`,
            game_id: uuidv4(),
          });
          source.value = netWin;
        }
      }
    }
  }, 8000);

  gameLogic.addTimeout(spinWheelTimeout);
};

const handleSpin = () => {
  if (!isSpinning.value && !showResult.value) {
    spinWheel();
  }
};

const handleClose = () => {
  if (
    multiplierWin.value &&
    (multiplierWin.value.multiplier === 6 || multiplierWin.value.multiplier === 1)
  ) {
    gameStore.setShowSpinTheWheel(false);
    multiplierWin.value = null;
  }

  if (multiplierWin.value) {
    const updatedBets = [
      ...gameStore.getAllBets,
      `+${formatCurrency(gameStore.getBetOnAce * multiplierWin.value.multiplier)}`,
    ];
    gameStore.setAllBets(updatedBets);
    gameStore.setBetOnAce(0);
  }

  cleanup();
  gameStore.setShowSpinTheWheel(false);
  multiplierWin.value = null;
};

onMounted(() => {
  // Reset state on mount
  rotation.value = 0;
  isSpinning.value = false;
  showResult.value = false;
  multiplierWin.value = null;

  // Auto-spin after a delay
  autoSpinTimeout.value = setTimeout(() => {
    if (!isSpinning.value && !showResult.value) {
      spinWheel();
    }
  }, 1000) as unknown as number;
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
.layer {
  pointer-events: none;
}

.wheel-container {
  animation: popup 0.25s ease-in-out;
  position: relative;
  width: 700px;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wheel {
  z-index: 99;
  position: absolute;
  width: 700px;
  height: 700px;
  transform-origin: center center;
  transition: transform 8s cubic-bezier(0.33, 1, 0.68, 1);
  will-change: transform;
  transform: translateZ(0) rotate(0deg);
}

.wheel-arrow {
  z-index: 99;
}

.wheel-bg {
  z-index: 98;
  position: absolute;
  bottom: -10%;
}

.win-overlay {
  width: 100%;
  height: 100dvh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: popup 0.25s ease-in-out;
}

.banner {
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
  position: absolute;
  bottom: -40%;
}

.close-text {
  position: absolute;
  bottom: -10%;
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

/* Responsive styles */

@media screen and (max-width: 768px) {
  .wheel-container {
    width: 500px;
    height: 500px;
  }

  .wheel {
    width: 500px;
    height: 500px;
  }

  .border-wheel {
    width: 400px;
    height: 400px;
  }

  .wheel-bg {
    bottom: -8%;
    width: 500px;
  }
}

@media screen and (max-width: 520px) {
  .wheel-container {
    width: 350px;
    height: 350px;
  }

  .wheel {
    width: 350px;
    height: 350px;
  }

  .wheel-arrow {
    width: 100px;
    height: 100px;
  }

  .wheel-bg {
    bottom: -10%;
    width: 300px;
  }

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
    bottom: 5%;
  }
}
</style>
