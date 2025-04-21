<template>
  <div>
    <div class="layer"></div>
    <div class="wheel-container">
      <img :src="Wheel" class="wheel" :style="{ transform: `rotate(${rotation}deg)` }" />
      <img src="../assets/feet_wheel.png" class="wheel-bg" />
      <el-image :src="BorderWheel" class="border-wheel"></el-image>>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BorderWheel from '@/assets/border_wheel.png'
import Wheel from '@/assets/wheel-new.png'

const rotation = ref(0)

const spinWheel = () => {
  console.log('click')

  const fullRotations = 360 * 10
  const extraDeg = Math.floor(Math.random() * 360)
  const total = fullRotations + extraDeg

  rotation.value = Math.round(rotation.value + total)
}

onMounted(() => {
  spinWheel()
})
</script>

<style scoped>
.layer {
  pointer-events: none;
}

.wheel {
  z-index: 99;
  position: absolute;
  right: 33%;
  top: 2%;
  width: 670px;
  transform-origin: center center;
  transition: transform 8s cubic-bezier(0.33, 1, 0.68, 1);
  will-change: transform;
  transform: translateZ(0) rotate(0deg);
}

.border-wheel {
  z-index: 99;
  position: absolute;
  right: 33%;
  top: 2.6%;
  width: 663px;
}

.wheel-bg {
  z-index: 98;
  position: absolute;
  right: 33%;
  top: 77%;
  width: 650px;
}

.layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 97;
}
</style>
