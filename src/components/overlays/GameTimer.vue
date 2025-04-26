<template>
  <div v-if="useGameStore().getStartinIn === 0" class="timer-container">
    <div class="timer">{{ useGameStore().getTimer }}</div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores'
</script>

<style scoped>
.timer-container {
  position: fixed;
  top: 15%;
  z-index: 1;
  width: 70px;
  height: 70px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid var(--primary-red);
  background: rgba(0, 0, 0, 0.1);
}

.timer {
  color: var(--primary-yellow);
  text-shadow:
    -3px 0 var(--primary-red),
    0 3px var(--primary-red),
    3px 0 var(--primary-red),
    0 -3px var(--primary-red);
  font-size: 36px;
}
</style>
