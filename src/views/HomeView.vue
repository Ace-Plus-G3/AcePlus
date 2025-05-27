<template>
  <el-container>
    <HeaderComponent />
    <div class="main-container" style="">
      <div class="title-container">
        <el-image :src="Star" class="star" draggable="false" />
        <h1>ACE+</h1>
        <h5 class="sub-title">Banker Game Plus</h5>
        <p>Bet on highest card and win up to billions</p>
      </div>
      <div class="button-container">
        <div v-if="!playerStore.getToken" class="btn-container">
          <el-button class="gold-bg btns" @click="openModal('Login-Tab')">Play Now!</el-button>
          <el-button class="gold-bg btns" @click="openSettings">Settings</el-button>
        </div>
        <div v-if="playerStore.getToken" class="btn-container">
          <el-button class="gold-bg btn" @click="gotoGame">Play Now!</el-button>
          <el-button class="gold-bg btn" @click="openTutorial">Instructions</el-button>
          <el-button class="gold-bg btn" @click="openSettings">Settings</el-button>
        </div>
      </div>
      <div class="wheel-container">
        <div ref="wheelRef" class="wheel">
          <el-image :src="defaultWheel" fit="cover" draggable="false" />
        </div>
        <div ref="jackpotWheelRef" class="jackpotWheel">
          <el-image :src="jackpotWheel" fit="cover" draggable="false" />
        </div>
      </div>
      <CardHomeView v-for="item in 5" :key="item" :index="item" />
    </div>
  </el-container>

  <div>
    <AuthModal v-model="playerStore.isModalVisible" :active-tab-value="playerStore.activeTab" />
    <SettingsModal :show-settings="showSettings" @handle-close="handleCloseSettings" />
  </div>
</template>

<script setup lang="ts">
import defaultWheel from '@/assets/default_wheel.png';
import Star from '@/assets/invite_star.png';
import jackpotWheel from '@/assets/jackpot_wheel.png';
import AuthModal from '@/components/AuthModal.vue';
import CardHomeView from '@/components/CardHomeView.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import { usePlayerStore } from '@/stores';
import { useMotion } from '@vueuse/motion';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SettingsModal from '@/components/SettingsModal.vue';

const playerStore = usePlayerStore();
const router = useRouter();
const route = useRoute();
const wheelRef = ref<HTMLElement>();
const jackpotWheelRef = ref<HTMLElement>();
const showSettings = ref<boolean>(false);

const openSettings = () => {
  showSettings.value = true;
};

const handleCloseSettings = () => {
  showSettings.value = false;
};

const openModal = (tab: string) => {
  playerStore.setActiveTab(tab as 'Signup-Tab' | 'Login-Tab');
  playerStore.setIsModalVisible(true);
};

const gotoGame = () => {
  console.log('isNewUser', playerStore.isNewUser);
  if (playerStore.isNewUser) {
    router.push({ name: 'tutorial', query: { tutorial: 'true' } });
    if (playerStore.getUser) {
      playerStore.updateIsNewUser(playerStore.getUser.user_id, false);
    }
  } else {
    router.push({ name: 'game' });
  }
};

const openTutorial = () => {
  router.push({ name: 'tutorial', query: { tutorial: 'true' } });
};

onMounted(() => {
  if (route.query.from === 'signup') {
    openModal('Signup-Tab');

    router.replace({ path: '/', query: {} });
  }
  useMotion(wheelRef, {
    initial: {
      scale: 0,
      rotate: 0,
    },
    enter: {
      scale: 1,
      rotate: 360, // rotate multiple times (30s * 360 deg / 3s)
      transition: {
        scale: {
          duration: 500,
          delay: 750,
        },
        rotate: {
          duration: 30000,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    },
  });
  useMotion(jackpotWheelRef, {
    initial: {
      scale: 0,
      rotate: 0,
    },
    enter: {
      scale: 1,
      rotate: 360, // rotate multiple times (30s * 360 deg / 3s)
      transition: {
        scale: {
          duration: 500,
          delay: 750,
        },
        rotate: {
          duration: 30000,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    },
  });
});
</script>

<style scoped>
.el-container {
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #333333;
  gap: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  background: linear-gradient(0deg, rgba(51, 51, 51, 1) 0%, rgba(10, 10, 10, 1) 100%);
  overflow: hidden !important;
}
.main-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}
.title-container {
  z-index: 100;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .left {
    text-align: center;
    padding-top: 2%;
  }
  p {
    font-size: 14px;
    color: #6c6c6c;
    font-family: 'Poppins', sans-serif;
  }
  h1 {
    font-size: 10em;
    color: #f9c80e;
    text-shadow: 4px 4px 15px rgba(125, 31, 34, 0.72);
  }
  h5 {
    font-size: 3em;
    text-align: center;
    color: #f9c80e;
    text-shadow: 4px 4px 15px rgba(125, 31, 34, 0.72);
  }
}
.btn-container {
  padding-top: 7%;
  position: relative;
  z-index: 9999;
}
.star {
  position: absolute;
  top: -20%;
  left: -15%;
  width: 200px;
  height: 200px;
}
:deep(.el-button) {
  border: none;
  border-radius: 30px;
  color: #2c2121;
  font-size: 14px;
  width: 120px;
  height: 40px;
}
:deep(.el-button):hover {
  scale: 1.1;
  cursor: pointer;
}
.wheel {
  position: absolute;
  left: 10%;
  bottom: 0%;
  opacity: 0.4;
  width: 500px;
  height: 500px;
  /* animation: rotateWheel 30s linear infinite; */
}
.jackpotWheel {
  position: absolute;
  right: 10%;
  bottom: 0%;
  opacity: 0.4;
  width: 500px;
  height: 500px;
  /* animation: rotateWheel 30s linear infinite; */
}

:deep(.btn) {
  padding: 0 !important;
}

@keyframes rotateWheel {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: 506px) {
  h1 {
    font-size: 4em !important;
  }
  h5 {
    font-size: 1em !important;
  }
  .btn-container {
    padding: 4px;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    gap: 0.5em;
  }
  .btn {
    margin: 0;
    padding: 0;
    width: 120px;
    height: 40px;
    font-size: 16px;
  }
}

@media screen and (max-width: 769px) {
  .jackpotWheel {
    display: none;
  }
  .wheel {
    width: 400px;
    height: 400px;
    left: -25%;
    bottom: -10%;
  }
}

@media screen and (max-width: 1360px) {
  .main-container {
    padding-top: 0em;
  }
}

@media screen and (max-width: 1024px) and (max-height: 600px),
  screen and (max-width: 1280px) and (max-height: 800px) {
  .wheel,
  .jackpotWheel {
    width: 400px;
    height: 400px;
  }
  .title-container {
    z-index: 2000;
  }

  .title-container h1 {
    font-size: 5em;
  }
  .title-container h5 {
    font-size: 2em;
  }
}

@media screen and (max-width: 412px) and (max-height: 914px) {
  .btn-container {
    gap: 2em;
  }

  .main-container {
    gap: 60px;
  }

  .el-button {
    width: 180px;
    height: 50px;
  }

  .title-container h1 {
    font-size: 6em !important;
  }

  .star {
    top: -40%;
    left: -25%;
  }
}

/* @media screen and (height: 1368px) {
  .wheel {
    left: -20%;
  }
} */

@media screen and (height: 1368px) {
  .wheel,
  .jackpotWheel {
    width: 700px;
  }
  .wheel {
    left: -25%;
    bottom: 20%;
  }

  .jackpotWheel {
    right: -20%;
    bottom: 20%;
  }
  .el-button {
    width: 200px;
    height: 50px;
  }
}

@media screen and (max-width: 768px) and (max-height: 1024px) {
  .wheel {
    width: 600px;
    height: 600px;
  }

  .card-container {
    width: 320px;
    height: 500px;
    bottom: -4%;
  }
}

@media screen and (max-width: 412px) and (max-height: 915px) {
  .card-container {
    width: 260px;
    height: 400px;
  }

  .btn-container {
    gap: 25px;
    margin-top: 10px;
  }
}

@media screen and (max-width: 320px) and (max-height: 48px) {
  .title-container h1 {
    font-size: 20px !important;
  }
}

@media screen and (max-width: 360px) and (max-height: 740px),
  screen and (max-width: 390px) and (max-height: 844px) {
  .btn-container {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .el-button {
    width: 100px;
    height: 30px;
    font-size: 0.7em;
  }

  .main-container {
    gap: 20px;
  }
}

@media screen and (max-width: 414px) and (max-height: 896px) {
  .btn-container {
    display: flex;
    flex-direction: row;
  }

  .main-container {
    gap: 30px;
  }

  .card-container {
    bottom: -10%;
  }

  .wheel {
    top: 25%;
  }
}

@media screen and (max-width: 425px) and (max-height: 848px) {
  .btn-container {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .main-container {
    gap: 30px;
  }

  .card-container {
    bottom: -15%;
  }
  .wheel {
    top: 24%;
  }
}

@media screen and (height: 800px) {
  .title-container h1 {
    font-size: 6em;
  }
  .wheel,
  .jackpotWheel {
    width: 530px;
    height: 530px;
  }
}

@media screen and (min-width: 375px) and (max-height: 848px) {
  .el-button {
    width: 100px;
    height: 40px;
    font-size: 0.8em;
  }
}

@media screen and (min-width: 320px) and (min-height: 848px) {
  .el-button {
    width: 90px;
    height: 35px;
    font-size: 0.7em;
  }
}
</style>
