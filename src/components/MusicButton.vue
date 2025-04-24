<template>
  <audio ref="audioRef" controls autoplay class="audio">
    <source src="../assets/audio/jazz_mbg.MP3" type="audio/mpeg" />
  </audio>

  <div class="music-btn-container" @click="toggleMute">
    <component :is="isMuted ? Mute : UnMute" class="music-btn" />
  </div>
</template>

<script setup lang="ts">
import UnMute from '@/assets/svg/unmute_svg.vue'
import Mute from '@/assets/svg/mute_svg.vue'
import { ref, onMounted } from 'vue'

const audioRef = ref<HTMLAudioElement | null>(null)
const isMuted = ref(false)

const toggleMute = () => {
  if (audioRef.value) {
    isMuted.value = !isMuted.value
    audioRef.value.muted = isMuted.value
    audioRef.value.play()
  }
}

onMounted(() => {
  toggleMute()
})
</script>

<style scoped>
.audio {
  display: none;
}

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
