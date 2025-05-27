<template>
  <el-header>
    <div class="el-header-top-bar">
      <div class="el-header-image">
        <el-dropdown>
          <button id="leave-btn" class="leave-btn gold-bg">Menu</button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="openSettings">Settings</el-dropdown-item>
              <el-dropdown-item @click="openTutorial">Tutorial</el-dropdown-item>
              <el-dropdown-item @click="router.push({ name: 'transaction-history' })"
                >Wallet</el-dropdown-item
              >
              <el-dropdown-item @click="router.push('/')">Leave</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div id="jackpot-container" class="jackpot-container">
          <el-text class="jackpot-amount"> ₱ {{ formatCurrency(outputValue) }} </el-text>
          <div class="jackpot-text-container">
            <img :src="JackpotText" class="jackpot-text" alt="" />
          </div>
        </div>
        <div class="wallet-amount-container">
          <el-text class="chip-amount-text" style="color: white" size="small"
            >Balance: ₱{{ formatCurrency(creditStore.getCurrentBalance) }}</el-text
          >
        </div>
        <!-- <MusicButton /> -->
        <!-- <button
          id="leave-btn"
          class="wallet-btn leave-btn gold-bg"
          @click="router.push({ name: 'transaction-history' })"
        >
          Wallet
        </button> -->
        <!-- <div class="chip-amount" @click="router.push({ name: 'transaction-history' })">
          <el-text class="chip-amount-text" style="color: white" size="small"
            >₱ {{ formatCurrency(creditStore.getCurrentBalance) }}</el-text
          >
        </div> -->
      </div>
    </div>
    <SettingsModal :show-settings="showSettings" @handle-close="handleCloseSettings" />
  </el-header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCreditStore, useGameStore } from '@/stores';
import JackpotText from '@/assets/jackpot-text.png';
import { convertToReadableFormat, formatCurrency } from '@/utils/convertMoney';
import { useTransition } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';
import MusicButton from '../MusicButton.vue';
import SettingsModal from '../SettingsModal.vue';
import MenuSvg from '@/assets/svg/menu_svg.vue';

const gameStore = useGameStore();
const creditStore = useCreditStore();

const source = ref(0);
const router = useRouter();
const outputValue = useTransition(source, { duration: 1000 });
const showSettings = ref<boolean>(false);

const handleCloseSettings = () => {
  showSettings.value = false;
};

const openSettings = () => {
  showSettings.value = true;
};

const openTutorial = () => {
  router.push({ name: 'tutorial', query: { tutorial: 'true' } });
};

onMounted(() => {
  const storedJackpot = localStorage.getItem('accumulatedJackpot');
  gameStore.setAccumulatedJackpot(storedJackpot ? parseFloat(storedJackpot) : 0); // Default to 0 if no value exists
});

watch(
  () => gameStore.getAccumulatedJackpot,
  (newValue) => {
    source.value = newValue;
  },
  { immediate: true },
);
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
    min-width: 320px;
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
      background-image: url('@/assets/svg/wallet.svg');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      width: 40px;
      height: 30px;

      display: flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;
    }
    .wallet-btn {
    }

    .chip-amount:hover {
      scale: 1.1;
      cursor: pointer;
    }

    .leave-btn {
      height: 40px;
      width: 120px;

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
  right: 42%;
}

.jackpot-text-container {
  display: flex;
}

.jackpot-amount {
  font-family: 'Roboto', sans-serif !important;
  font-weight: 900 !important;
  font-size: clamp(16px, 32px, 48rem);
  /* Responsive font size */
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

@media screen and (max-width: 768px) {
  .jackpot-text img {
    width: 140px !important;
    height: 30px !important;
  }

  .leave-btn {
    font-size: 12px !important;
    width: 80px !important;
    height: 30px !important;
  }

  .chip-amount {
    width: 100px !important;
    height: 30px !important;
  }

  .chip-amount-text {
    font-size: 10px;
  }

  .jackpot-text-container {
    top: 110% !important;
    right: 38% !important;
  }
}

@media screen and (max-width: 800px) {
  .el-header {
    width: 90% !important;
  }
}

@media screen and (max-width: 425px) {
  .el-header-image {
    padding: 0 15px !important;
  }

  .jackpot-container {
    width: 160px !important;
    height: 70px !important;
    background-size: contain !important;
    margin-top: 30px !important;
    margin-left: 10px;
  }

  .jackpot-amount {
    font-size: 14px !important;
  }

  .leave-btn {
    width: 50px !important;
    font-size: 10px !important;
    height: 20px !important;
  }

  .jackpot-amount {
    font-size: 1.5em;
  }

  .chip-amount {
    width: 80px !important;
    height: 30px !important;
  }

  .chip-amount-text {
    font-size: 6px !important;
  }

  .jackpot-text-container {
    top: 120% !important;
    right: 38%;
  }

  .jackpot-text {
    width: 96px;
  }
}

@media screen and (max-width: 1024px) {
  .jackpot-text-container {
    top: 110% !important;
    right: 38% !important;
  }
}

@media screen and (max-width: 1440px) {
  .jackpot-text-container {
    top: 110% !important;
    right: 38% !important;
  }
}

@media screen and (max-width: 2560px) {
  .jackpot-text-container {
    top: 110% !important;
    right: 38% !important;
  }
}

@media screen and (max-width: 320px) {
  .wallet-amount-container {
    margin-left: 4px;
    display: flex;
    width: auto;
  }
}
</style>
