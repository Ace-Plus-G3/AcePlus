<template>
  <div class="music-btn-container">
    <UnMute class="music-btn" />
  </div>
</template>

<script setup lang="ts">
import UnMute from '@/assets/svg/unmute_svg.vue'
</script>

<style scoped>
.music-btn {
  position: absolute;
  right: 10%;
  top: 3%;
}

.music-btn:hover {
  scale: 1.1;
  cursor: pointer;
}
</style>
