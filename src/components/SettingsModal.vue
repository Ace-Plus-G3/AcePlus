<template>
  <el-dialog
    :model-value="showSettings"
    width="500"
    center
    align-center
    :modal="true"
    :before-close="closeModal"
    style="background-color: var(--primary-black); padding: 30px"
  >
    <el-text size="large" class="gold-text">Audio Settings</el-text>
    <el-row :gutter="20" style="margin-top: 1em">
      <el-col :span="24">
        <el-text size="small" class="gold-text">Background Music</el-text>
      </el-col>
      <el-col :span="24">
        <el-slider @change="handleBackgroundMusic" v-model="gameStore.background_music" />
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 1em">
      <el-col :span="24">
        <el-text size="small" class="gold-text">Card Sound</el-text>
      </el-col>
      <el-col :span="24">
        <el-slider @change="handleCardMusic" v-model="gameStore.card_music" />
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 1em">
      <el-col :span="24">
        <el-text size="small" class="gold-text">Wheel Sound</el-text>
      </el-col>
      <el-col :span="24">
        <el-slider @click="handleWheelMusic" v-model="gameStore.wheel_music" />
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 1em">
      <el-col :span="24">
        <el-text size="small" class="gold-text">Win Sound</el-text>
      </el-col>
      <el-col :span="24">
        <el-slider @click="handleWinMusic" v-model="gameStore.win_music" />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores';

const emits = defineEmits(['handleClose']);
defineProps<{ showSettings: boolean }>();

const gameStore = useGameStore();
const closeModal = () => {
  emits('handleClose');
};

const handleBackgroundMusic = (value: number) => {
  gameStore.setBackgroundMusic(value);
};

const handleCardMusic = (value: number) => {
  gameStore.setCardMusic(value);
};

const handleWheelMusic = (value: number) => {
  gameStore.setWheelMusic(value);
};

const handleWinMusic = (value: number) => {
  gameStore.setWinMusic(value);
};
</script>

<style scoped></style>
