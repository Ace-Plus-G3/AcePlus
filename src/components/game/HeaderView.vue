<template>
  <el-header>
    <div class="el-header-top-bar">
      <div class="el-header-image">
        <button class="leave-btn" @click="router.push('/')">Leave</button>
        <div class="jackpot-container">
          <el-text class="jackpot-amount">
            {{ formatCurrency(outputValue) }}
          </el-text>
          <div class="jackpot-text-container">
            <img :src="JackpotText" class="jackpot-text" alt="" />
          </div>
        </div>
        <div class="chip-amount">
          <el-text class="chip-amount-text" style="color: white" size="small">{{
            convertToReadableFormat(useCreditStore().getCurrentBalance)
          }}</el-text>
        </div>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCreditStore } from '@/stores'
import JackpotText from '@/assets/jackpot-text.png'
import { convertToReadableFormat, formatCurrency } from '@/utils/convertMoney'
import { useTransition } from '@vueuse/core'
import { ref } from 'vue'

const source = ref(0)
const router = useRouter()
const outputValue = useTransition(source, { duration: 1000 })
</script>

<style scoped>
.el-header {
  width: 100%;
  padding: 0 !important;
  margin: 0 !important;
  height: auto !important;

  display: flex;
  align-items: center;
  justify-content: center;

  .el-header-top-bar {
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

  .el-header-image {
    width: 100%;
    height: 100%;

    background-image: url('@/assets/game/topbar.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    z-index: 2;

    .chip-amount {
      background-image: url('@/assets/coins/chip_amount.png');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      width: 120px;
      height: 50px;

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .leave-btn {
      height: 40px;
      width: 120px;

      background: #ffca28;
      border: none;
      border-radius: 20px;
      /* padding: 4px 12px; */
      font-size: 14px;
      font-weight: bold;
      color: #00397f;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      transition: background 0.3s;
    }
  }
}

.jackpot-text-container {
  background-size: cover;
  margin: 0 auto;
  z-index: 55;
  position: absolute;
  top: 103%;
  right: 38%;
}

.jackpot-text-container {
  display: flex;
}

.jackpot-amount {
  font-family: 'Roboto', sans-serif !important;
  font-weight: 900 !important;
  font-size: clamp(16px, 32px, 48rem); /* Responsive font size */
  background: linear-gradient(180deg, rgba(145, 90, 16, 1) 15%, rgba(68, 40, 2, 1) 75%);
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.jackpot-container {
  background-image: url('../../assets/jackpot_bgg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 350px;
  height: 80px;
  margin-top: 55px;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* position: absolute;
  right: 30%;
  top: 40%; */
}
</style>
