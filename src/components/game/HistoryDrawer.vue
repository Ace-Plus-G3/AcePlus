<template>
  <el-drawer
    direction="btt"
    @close="gameStore.setShowGameHistoryDrawer(false)"
    v-model="gameStore.showHistoryDrawer"
    :with-header="false"
  >
    <div id="drawer" class="custom-drawer">
      <div class="custom-drawer-header">
        <span class="title gold-text">Game History</span>
        <button class="cancel-btn" @click="handleCloseDrawer">Cancel</button>
      </div>
      <div class="drawer-content">
        <el-row
          class="game-history-container"
          v-for="item in gameStore.gameHistory"
          :key="item.amount"
        >
          <span
            style="
              display: flex;
              flex-direction: column;
              justify-content: start;
              align-items: start;
            "
          >
            <el-text size="small" style="width: 100%; text-align: start; font-size: 10px">{{
              moment(item.date).format('h:mm a')
            }}</el-text>
            <el-text
              class="status-text"
              size="large"
              style="font-size: 24px; letter-spacing: 6px"
              :class="{
                green: item.type === 'WIN',
                red: item.type === 'LOSE',
              }"
              >{{ item.type }}</el-text
            >
            <el-text size="small" style="width: 100%; text-align: start; font-size: 12px">{{
              `₱ ${convertToReadableFormat(item.betValue)}`
            }}</el-text>
          </span>
          <el-text
            class="amount-text"
            style="font-size: 24px; letter-spacing: 4px"
            :class="{
              green: item.type === 'WIN',
              red: item.type === 'LOSE',
            }"
            >{{
              `${item.type === 'WIN' ? '+' : '-'} ₱${convertToReadableFormat(item.amount)}`
            }}</el-text
          >
        </el-row>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores';
import { convertToReadableFormat } from '@/utils/convertMoney';
import moment from 'moment';

const gameStore = useGameStore();

const handleCloseDrawer = () => {
  gameStore.setShowGameHistoryDrawer(false);
};
</script>

<style scoped>
.game-history-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em 2em 1em 2em;
  scrollbar-width: none;
}
.green {
  color: green;
}
.red {
  color: red;
}
/* Drawer Styles*/
:deep(.el-overlay) {
  overflow: hidden !important;
  display: flex;
  justify-content: center;
}

:deep(.el-drawer) {
  height: 50% !important;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

:deep(.el-overlay) {
  display: flex !important;
  justify-content: center !important;
  align-items: end !important;
}

:deep(.el-drawer__body) {
  padding: 0;
  margin: 0;
  max-width: 800px;
  min-width: 375px;
  width: 100% !important;
  height: 100% !important;
}

.custom-drawer {
  max-width: 800px;
  min-width: 375px;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

:deep(.el-overlay) {
  overflow: hidden !important;
  display: flex;
  justify-content: center;
}

:deep(.el-drawer) {
  overflow: hidden;
  background: none;
  height: 50% !important;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
}

:deep(.el-drawer__body) {
  padding: 0;
  margin: 0;
  max-width: 800px;
  min-width: 375px;
  width: 100%;
  height: 100%;
}

.custom-drawer {
  max-width: 800px;
  min-width: 375px;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Custom header */
.custom-drawer-header {
  max-width: 800px;
  min-width: 375px;
  width: 90%;
  aspect-ratio: 8.88 / 1;

  background-image: url('@/assets/game/bottombar.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  z-index: 2;
}

.drawer-content {
  scrollbar-width: none;
  width: 85%;
  height: 100%;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: auto;
  background-image: url('@/assets/game/drawer_bg.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  margin: 0;
  /* padding: 20px; */
}

.title {
  color: #ffca28;
  font-weight: bold;
  font-size: 16px;
}

.cancel-btn {
  background-color: #e8b839;
  background: linear-gradient(
    90deg,
    rgba(232, 184, 57, 1) 0%,
    rgba(232, 184, 57, 1) 35%,
    rgba(186, 129, 21, 1) 63%,
    rgba(251, 246, 127, 1) 82%,
    rgba(220, 188, 78, 1) 100%
  );
  border: none !important;
  border: none;
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: background 0.3s;
}

.cancel-btn:hover {
  cursor: pointer;
}

.cancel-btn:hover {
  background: #ffd54f;
}

@media screen and (max-width: 425px) {
  .custom-drawer-header {
    padding: 0 15px !important;
  }

  .status-text,
  .amount-text {
    font-size: 20px !important;
  }
}

@media screen and (max-width: 800px) {
  .custom-drawer-header {
    width: 90% !important;
  }

  :deep(.el-drawer__body) {
    width: 100%;
  }
}
</style>
