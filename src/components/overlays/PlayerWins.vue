<template>
  <div v-if="game_status === 'WIN'" class="win-overlay">
    <el-image :src="WIN_ICON" />
  </div>
</template>

<script setup lang="ts">
import WIN_ICON from '@/assets/game/title_win.png'
type TProps = {
  game_status: 'WIN' | 'LOSE' | 'PENDING'
}

defineProps<TProps>()
</script>

<style scoped>
.win-overlay {
  animation: popup 0.5s ease-in-out;
  position: fixed;
  z-index: 1000;
}

/* Responsive styles */

@keyframes popup {
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
