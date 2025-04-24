<template>
  <audio ref="audioRef" :src="WheelSFX" controls autoplay class="audio"></audio>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WheelSFX from '@/assets/audio/sample1_wheel.mp3'

const audioRef = ref<HTMLAudioElement | null>(null)
// const isMuted = ref(true)
const enableAudio = () => {
  if (audioRef.value) {
    audioRef.value.muted = true // Start muted to bypass autoplay restrictions
    audioRef.value.play().catch((err) => console.error('Autoplay blocked:', err))
  }
}
onMounted(() => {
  document.addEventListener('focus', enableAudio, { once: true })
})
// onMounted(() => {
//   const enableAudio = () => {
//     if (audioRef.value) {
//       audioRef.value.play()
//     }
//   }
//   document.addEventListener('focus', enableAudio, { once: true })
//   // document.addEventListener('mousemove', enableAudio, { once: true })
//   // document.addEventListener('keydown', enableAudio, { once: true })
//   // if (audioRef.value) {
//   //   audioRef.value.play()
//   // }
// })
</script>

<style scoped>
.audio {
  display: none;
}
</style>
