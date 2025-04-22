<template>
  <div class="overlay" v-if="game_status === 'WIN'">
    <div class="win-overlay">
      <el-image :src="WIN_ICON" />
    </div>
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
.overlay {
  width: 100%;
  height: 100dvh;

  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.win-overlay {
  animation: popup 0.5s ease-in-out;
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
