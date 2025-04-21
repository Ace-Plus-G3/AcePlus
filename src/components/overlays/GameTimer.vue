<template>
  <div v-if="startingIn === 0" class="timer-container">
    <div class="timer">{{ timer }}</div>
  </div>
</template>

<script setup lang="ts">
type TProps = {
  startingIn: number
  timer: number
}

defineProps<TProps>()
</script>

<style scoped>
.timer-container {
  position: fixed;
  top: 10%;
  z-index: 1;
  width: 100px;
  height: 100px;
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
  font-size: 46px;
}
</style>
