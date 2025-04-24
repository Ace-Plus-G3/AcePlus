<template>
  <audio ref="audioRef" loop class="audio">
    <source src="../assets/audio/jazz_mbg.MP3" type="audio/mpeg" />
  </audio>

  <div class="music-btn-container" @click="toggleMute">
    <component :is="isMuted ? Mute : UnMute" class="music-btn" />
  </div>
</template>

<script setup lang="ts">
import UnMute from '@/assets/svg/unmute_svg.vue';
import Mute from '@/assets/svg/mute_svg.vue';
import { onMounted, ref } from 'vue';

const audioRef = ref<HTMLAudioElement | null>(null);
const isMuted = ref(true); 

const toggleMute = () => {
  if (audioRef.value) {
    isMuted.value = !isMuted.value;
    audioRef.value.muted = isMuted.value;

    if (!isMuted.value) {
      audioRef.value.play().catch((error) => {
        console.warn('Playback failed. Waiting for user interaction.', error);
      });
    }
  }
};

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.muted = true;
  }
});
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