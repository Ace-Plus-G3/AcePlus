<template>
  <el-footer>
    <div class="el-footer-bottom-bar">
      <div class="el-footer-image">
        <div class="text-container">
          <span class="title">Total Bets:</span>
          <el-text class="total-bet-text">
            {{ formatCurrency(0) }}
          </el-text>
        </div>
        <div class="text-container">
          <span class="title">Total Players:</span>
          <el-text class="total-bet-text">
            {{ formatCurrency(0) }}
          </el-text>
        </div>
      </div>
    </div>
  </el-footer>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/utils/convertMoney.ts'
</script>

<style scoped>
.el-footer {
  width: 100%;
  padding: 0 !important;
  margin: 0 !important;
  height: auto !important;

  display: flex;
  align-items: center;
  justify-content: center;

  .el-footer-bottom-bar {
    max-width: 800px;
    min-width: 350px;
    width: 100%;
    aspect-ratio: 8.88 / 1;
    position: relative;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
    margin: 0 !important;
  }

  .el-footer-image {
    width: 100%;
    height: 100%;

    background-image: url('@/assets/game/bottombar.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    z-index: 2;

    .title,
    .total-bet-text {
      color: #ffca28;
      font-weight: bold;
      font-size: 16px;
    }
  }

  .text-container {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

@media screen and (max-width: 800px) {
  .el-header,
  .el-footer {
    width: 90% !important;
  }

  .title,
  .total-bet-text {
    font-size: 12px !important;
  }

  .custom-drawer-header {
    width: 90% !important;
  }

  :deep(.el-drawer__body) {
    width: 100%;
  }

  .chip img {
    width: 60px;
    height: 60px;
  }

  .bet-grid {
    gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }

  .timer-container {
    width: 80px;
    height: 80px;
  }

  .timer {
    font-size: 46px;
  }

  .countdown-text,
  .countdown-number {
    font-size: 28px;
  }
}

@media screen and (max-width: 768px) {
  .title {
    font-size: 14px;
  }
}

@media screen and (max-width: 425px) {
  .el-footer-image {
    padding: 0 15px !important;
  }
}
</style>
