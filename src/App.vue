<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { usePlayerStore } from './stores'

onMounted(() => {
  usePlayerStore().handlePersistLogin()
})
</script>

<style scoped></style>
