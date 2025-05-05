<template>
  <div v-if="gameStore.getStartinIn > 0" class="starting-countdown">
    <div class="countdown-text">Starting in:</div>
    <div class="countdown-number-container">
      <div class="countdown-number">{{ gameStore.getStartinIn }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores'

const gameStore = useGameStore()
</script>

<style scoped>
.starting-countdown {
  position: fixed;
  top: 15%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.countdown-text,
.countdown-number {
  color: var(--primary-yellow);
  text-shadow:
    -3px 0 var(--primary-red),
    0 3px var(--primary-red),
    3px 0 var(--primary-red),
    0 -3px var(--primary-red);
  font-size: 36px;
}

.countdown-number-container {
  width: 70px;
  height: 70px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid var(--primary-red);
  background: rgba(0, 0, 0, 0.1);
}

/* Responsive styles */

@media screen and (max-width: 720px) {
  .countdown-text,
  .countdown-number {
    font-size: 20px;
    text-shadow:
      -1px 0 var(--primary-red),
      0 1px var(--primary-red),
      1px 0 var(--primary-red),
      0 -1px var(--primary-red);
  }

  .countdown-number-container {
    width: 40px;
    height: 40px;
  }
}
</style>
