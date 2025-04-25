<template>
  <el-footer>
    <div class="el-footer-bottom-bar">
      <div class="el-footer-image">
        <span class="title">Place your bets !</span>
      </div>
    </div>
  </el-footer>
</template>

<script setup lang="ts"></script>

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
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    z-index: 2;

    .title {
      color: #ffca28;
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
