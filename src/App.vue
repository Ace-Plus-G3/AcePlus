<template>
  <RouterView />
  <TransactionStatusDialog
    v-if="dialogStore.isVisible"
    :status="dialogStore.status"
    :message="dialogStore.message"
    v-model:visible="dialogStore.isVisible"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCreditStore, useDialogStore, usePlayerStore } from './stores';
const creditStore = useCreditStore();
const playerStore = usePlayerStore();
const dialogStore = useDialogStore();

onMounted(() => {
  playerStore.handlePersistLogin();
  creditStore.handlePersistCredits();
});
</script>
