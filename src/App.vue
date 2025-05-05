<template>
  <!-- <MusicBtn /> -->

  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCreditStore, usePlayerStore } from './stores'
const creditStore = useCreditStore()
const playerStore = usePlayerStore()
onMounted(() => {
  playerStore.handlePersistLogin()
  creditStore.handlePersistCredits()
})
</script>
