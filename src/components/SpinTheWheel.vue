<template>
    <div>
        <div class="layer"></div>
        <div class="wheel-container">
            <img src="../assets/wheel.png" @click="spinWheel" class="wheel" alt="" :style="{ transform: `rotate(${rotation}deg)` }" />
            <img src="../assets/feet_wheel.png" class="wheel-bg">

            
        </div>

        
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const rotation = ref(0);

const spinWheel = () => {
  const fullRotations = 360 * 10;
  const extraDeg = Math.floor(Math.random() * 360);
  const total = fullRotations + extraDeg;

  rotation.value = Math.round(rotation.value + total);
};

</script>

<style scoped>
.wheel {
    z-index: 100;
    position: absolute;
    right: 33%;
    top: 2.6%;
    width: 663px;
    transform-origin: center center;
    transition: transform 8s cubic-bezier(0.33, 1, 0.68, 1);
    will-change: transform;
    transform: translateZ(0) rotate(0deg); /* 🔧 GPU hack */
}

.wheel-bg {
    z-index: 99;
    position: absolute;
    right: 33%;
    top: 68%;
    width: 650px;
}

.layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;

}
</style>