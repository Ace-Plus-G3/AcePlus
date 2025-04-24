<template>
  <MusicBtn />
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import MusicBtn from './components/MusicButton.vue'
import { useCreditStore, usePlayerStore } from './stores'

onMounted(() => {
  usePlayerStore().handlePersistLogin()
  useCreditStore().handlePersistCredits()
})
</script>

<style scoped></style>
