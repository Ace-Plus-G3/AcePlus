<template>
  <el-container>
    <HeaderComponent />
    <div class="main-container" style="">
      <div class="title-container">
        <el-image :src="Star" class="star" />
        <h1>ACE+</h1>
        <h5>Banker Game Plus</h5>
        <p>But on highest card and win up to billions</p>
        <div v-if="!playerStore.getToken" class="btn-container">
          <el-button class="gold-bg" @click="openModal('Login-Tab')">Play Now!</el-button>
          <el-button class="gold-bg" @click="openSettings">Settings</el-button>
        </div>
        <div v-if="playerStore.getToken" class="btn-container">
          <el-button class="gold-bg" @click="gotoGame">Play Now!</el-button>
          <el-button class="gold-bg" @click="openTutorial">Instructions</el-button>
          <el-button class="gold-bg" @click="openSettings">Settings</el-button>
        </div>
      </div>
      <div ref="wheelRef" class="wheel">
        <el-image :src="defaultWheel" fit="cover" />
      </div>
      <div ref="jackpotWheelRef" class="jackpotWheel">
        <el-image :src="jackpotWheel" fit="cover" />
      </div>
      <CardHomeView v-for="item in 5" :key="item" :index="item" />
    </div>
  </el-container>

  <div>
    <AuthModal v-model="isModalVisible" :active-tab-value="activeTabValue" />
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
import { useRouter } from 'vue-router';
import SettingsModal from '@/components/SettingsModal.vue';

const playerStore = usePlayerStore();
const router = useRouter();
const wheelRef = ref<HTMLElement>();
const jackpotWheelRef = ref<HTMLElement>();
const isModalVisible = ref(false);
const activeTabValue = ref<string>('Login-Tab');
const showSettings = ref<boolean>(false);

const openSettings = () => {
  showSettings.value = true;
};

const handleCloseSettings = () => {
  showSettings.value = false;
};

const openModal = (tab: string) => {
  activeTabValue.value = tab;
  isModalVisible.value = true;
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
</style>
