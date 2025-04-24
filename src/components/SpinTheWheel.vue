<template>
  <div v-if="multiplierWin === null" class="wheel-container" @click="handleSpin">
    <img
      draggable="false"
      :src="Wheel"
      class="wheel"
      :style="{ transform: `rotate(${rotation}deg)` }"
    />
    <img draggable="false" src="../assets/feet_wheel.png" class="wheel-bg" />
    <el-image draggable="false" :src="BorderWheel" class="border-wheel"></el-image>
  </div>
  <div class="win-overlay" v-if="multiplierWin?.multiplier === 0 || multiplierWin">
    <!-- <div class="win-overlay"> -->
    <div class="banner">
      <el-image fit="cover" :src="congratulations" class="congratulations" />
      <el-image fit="cover" :src="vfxLight" class="light-1" />
      <el-image fit="cover" :src="vfxLight" class="light-2" />
      <div class="text-container">
        <el-image :src="multiplierWin?.url" class="" />
        <el-text class="text">+{{ Math.round(outputValue) }}</el-text>
      </div>
      <el-text class="close-text" @click="emit('handleClose', false)">Click here to close</el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BorderWheel from '@/assets/border_wheel.png'
import Wheel from '@/assets/wheel-new-new.png'
import { wheelDeg } from '@/models/constants'
import vfxLight from '@/assets/game/vfx-light.png'
import congratulations from '@/assets/game/congratulations.png'
import type { TSpinWheel } from '@/models/type'
import { useCreditStore } from '@/stores'
import { useTransition } from '@vueuse/core'

// const props = defineProps<{
//   betAmount: number
//   multiplierWin: { multiplier: number } | null
// }>()

type Props = {
  betAmount: number
}

const emit = defineEmits(['handleClose'])
const props = defineProps<Props>()

const rotation = ref(0)
const isSpinning = ref(false)
const multiplierWin = ref<TSpinWheel | null>(null)

const source = ref(0)
const outputValue = useTransition(source, { duration: 1500 })

// Watch for changes and apply smooth transition
watch(
  () => props.betAmount * (multiplierWin.value ? multiplierWin.value.multiplier : 0),
  (newValue) => {
    source.value = newValue
  },
)

const spinWheel = () => {
  if (isSpinning.value) return

  console.log('Wheel spinning...')
  isSpinning.value = true

  const fullRotations = 360 * 10

  // 30% chance of bokya appearing
  const shouldBokyaAppear: boolean = Math.random() < 0.3
  console.log(shouldBokyaAppear)

  const randomIndex = Math.floor(Math.random() * wheelDeg.length)
  const selectedSlice = wheelDeg[randomIndex]
  const stopAtDegree = fullRotations - selectedSlice.deg

  // Set the new rotation value
  rotation.value = stopAtDegree

  console.log(`Spinning to: ${stopAtDegree}°`)
  console.log(`Selected slice: ${selectedSlice.deg}°, Multiplier: ${selectedSlice.multiplier}`)

  // Reset after animation completes
  setTimeout(() => {
    isSpinning.value = false
    multiplierWin.value = selectedSlice
    console.log(`Spin complete. Winner: Multiplier ${selectedSlice.multiplier}`)
    useCreditStore().setCurrentBalance(
      useCreditStore().getCurrentBalance + props.betAmount * multiplierWin.value.multiplier,
    )
  }, 8000)
}

const handleSpin = () => {
  if (!isSpinning.value) {
    spinWheel()
  }
}

onMounted(() => {
  setTimeout(() => {
    if (!isSpinning.value) {
      spinWheel()
    }
  }, 1000)
})
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

  transform-origin: center center;
  transition: transform 8s cubic-bezier(0.33, 1, 0.68, 1);
  will-change: transform;
  transform: translateZ(0) rotate(0deg);
}

.border-wheel {
  z-index: 99;
  position: absolute;
}

.wheel-bg {
  z-index: 98;
  position: absolute;
  bottom: 0;
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
</style>
