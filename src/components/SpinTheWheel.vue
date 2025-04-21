<template>
  <div class="wheel-container" @click="handleSpin">
    <img
      draggable="false"
      :src="Wheel"
      class="wheel"
      :style="{ transform: `rotate(${rotation}deg)` }"
    />
    <img draggable="false" src="../assets/feet_wheel.png" class="wheel-bg" />
    <el-image draggable="false" :src="BorderWheel" class="border-wheel"></el-image>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BorderWheel from '@/assets/border_wheel.png'
import Wheel from '@/assets/wheel-new-new.png'
import { wheelDeg } from '@/models/constants'

const rotation = ref(0)
const isSpinning = ref(false)

const spinWheel = () => {
  if (isSpinning.value) return

  console.log('Wheel spinning...')
  isSpinning.value = true

  // Number of full rotations for good spinning effect
  const fullRotations = 360 * 5 // 5 full rotations

  // Select a random winning slice
  const randomIndex = Math.floor(Math.random() * wheelDeg.length)
  const selectedSlice = wheelDeg[randomIndex]

  // Calculate where the wheel needs to stop
  // To make a specific slice stop at the top, we rotate to (360 - slice.deg)
  // The wheel rotates clockwise, so the top position is 0 degrees
  // Adding the full rotations ensures a good spinning animation
  const stopAtDegree = fullRotations + (360 - selectedSlice.deg)

  // Set the new rotation value
  rotation.value = stopAtDegree

  console.log(`Spinning to: ${stopAtDegree}°`)
  console.log(`Selected slice: ${selectedSlice.deg}°, Multiplier: ${selectedSlice.multiplier}`)

  // Reset after animation completes
  setTimeout(() => {
    isSpinning.value = false
    // Normalize the rotation to keep the value manageable
    rotation.value = rotation.value % 360
    console.log(`Spin complete. Winner: Multiplier ${selectedSlice.multiplier}`)
  }, 8000) // Match this to your CSS transition time
}

const handleSpin = () => {
  if (!isSpinning.value) {
    spinWheel()
  }
}
</script>

<style scoped>
.layer {
  pointer-events: none;
}
.wheel-container {
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

/* .layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 97;
} */
</style>
