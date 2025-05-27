<template>
  <el-tabs v-model="transactionStore.transactionType" class="demo-tabs" stretch>
    <el-tab-pane label="Cash-In" name="cashin">
      <slot name="cashin"></slot>
    </el-tab-pane>
    <el-tab-pane label="Cash-Out" name="cashout">
      <slot name="cashout"></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { useDialogStore } from '@/stores';

const transactionStore = useDialogStore();
</script>

<style scoped>
:deep(.el-tabs__item) {
  font-family: 'Lemon', sans-serif;
}

:deep(.el-tabs__item):hover {
  color: gray;
}

:deep(.is-active):hover {
  color: none;
}
</style>
