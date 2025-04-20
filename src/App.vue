<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { useCreditStore, usePlayerStore } from './stores'

onMounted(() => {
  usePlayerStore().handlePersistLogin()
  useCreditStore().handlePersistCredits()
})
</script>

<style scoped></style>
