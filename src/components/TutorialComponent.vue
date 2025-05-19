<template>
  <el-button class="skipBtn" v-if="isMessageOpen === false" @click="handleSkipTutorial"
    >Skip Tutorial
    <el-icon><DArrowRight /></el-icon>
  </el-button>
  <el-tour v-model="open" :show-close="false" @finish="handleFinishTutorial">
    <el-tour-step v-for="(step, index) in steps" :key="index" v-bind="step" />
  </el-tour>

  <el-dialog
    v-model="isMessageOpen"
    @close="handleCloseDialog"
    title="Skip Tutorial?"
    width="500"
    align-center
  >
    <div class="dialog-content">
      <div class="dialog-description">
        Are you sure to skip the tutorial and proceed to the game, or go back home? You can always
        come back to the tutorial whenever you need help.
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="footer-btn" @click="handleBackHome">Back to Home</el-button>
        <el-button class="footer-btn" type="primary" @click="handleGotoGame">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { steps } from '@/models/constants';
import { DArrowRight } from '@element-plus/icons-vue';

import { usePlayerStore } from '@/stores';

const router = useRouter();
const playerStore = usePlayerStore();

const handleFinish = () => {
  router.push({ name: 'game', query: { tutorial: 'false' } });
};

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
});

const open = ref(false);
const isMessageOpen = ref(false);

const handleSkipTutorial = () => {
  open.value = false;
  isMessageOpen.value = true;
};

const handleFinishTutorial = () => {
  open.value = false;
  isMessageOpen.value = true;
}

const handleCloseDialog = () => {
  isMessageOpen.value = false;
  open.value = true;
};

const handleBackHome = () => {
  router.push({ name: 'home', query: { tutorial: 'false' } });
};

const handleGotoGame = () => {
  if (playerStore.getUser) {
    playerStore.updateIsNewUser(playerStore.getUser.user_id, false);
  }
  router.push({ name: 'game', query: { tutorial: 'false' } });
};

onUnmounted(() => {
  open.value = false;
  isMessageOpen.value = false;
});

watch(
  () => props.isOpen,
  (newValue) => {
    open.value = newValue;
  },
  { immediate: true },
);
</script>

<style scoped>
.skipBtn {
  position: fixed;
  top: 30px;
  right: 40px;
  z-index: 3000;
  font-size: 1em;
  cursor: pointer;
  font-weight: 800;
  height: 40px;
}

.el-button:hover {
  scale: 1.1;
}

.el-icon {
  margin-left: 8px;
}

.el-dialog {
  z-index: 9000;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 8px 0;
}
.dialog-icon {
  font-size: 40px;
  color: #409eff;
  margin-bottom: 12px;
}

.dialog-description {
  font-size: 1.1em;
  color: #666;
  text-align: center;
  margin-bottom: 8px;
  max-width: 90%;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.footer-btn {
  min-width: 120px;
}
</style>
