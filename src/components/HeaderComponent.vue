<template>
  <el-header>
    <div class="logo-container">
      <el-image :src="Logo" class="logo" />
      <h3 class="logo-text">ACE+</h3>
    </div>
    <el-row style="display: flex; align-items: center; gap: 1em">
      <MusicButton />
      <div v-if="playerStore.getToken" class="right-container">
        <el-button link style="width: fit-content; height: fit-content" @click="goToWallet()">
          <Wallet />
        </el-button>
        <el-button class="gold-bg btn-register" @click="logoutDialogVisible = true"
          >Logout</el-button
        >
      </div>

      <div v-if="!playerStore.getToken" class="btn-container">
        <el-button link class="btn-login" @click="openModal('Login-Tab')">Login</el-button>
        <el-button class="gold-bg btn-register" @click="openModal('Signup-Tab')"
          >Register</el-button
        >
      </div>
    </el-row>
  </el-header>

  <div>
    <AuthModal v-model="isModalVisible" :active-tab-value="activeTabValue" />
    <el-dialog
      v-model="logoutDialogVisible"
      title="Confirm Logout"
      width="auto"
      style="max-width: 300px"
    >
      <span>Are you sure you want to logout?</span>
      <template #footer>
        <el-button @click="logoutDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmLogout">Confirm</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/logo_new.png';
import { usePlayerStore } from '@/stores';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Wallet from '../assets/svg/wallet_svg.vue';
import AuthModal from './AuthModal.vue';
import MusicButton from './MusicButton.vue';
import { showNotify } from '@/utils/notify';

const playerStore = usePlayerStore();
const router = useRouter();
const isModalVisible = ref(false);
const activeTabValue = ref<string>('Signup-Tab');

const logoutDialogVisible = ref(false);

const openModal = (tab: string) => {
  activeTabValue.value = tab;
  isModalVisible.value = true;
};

const goToWallet = () => {
  router.push({ name: 'transaction-history' });
};

const confirmLogout = () => {
  logoutDialogVisible.value = false;
  playerStore.handleLogout();
  showNotify({
    title: 'Success!',
    message: 'You have logout successfully.',
    type: 'success',
  });
  console.log('Logged out');
};
</script>

<style scoped>
.el-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 45px 96px 45px 96px;
}

.logo-container h3 {
  color: #f9c80e;
  font-size: 36px;
}

.logo {
  width: 80px;
  height: 80px;
  flex: 1;
  /* flex-shrink: 0; */
  /* flex-grow: 0; */
}

:deep(.el-button) {
  margin: 0 !important;
  font-family: 'Poppins', sans-serif !important;
}

.right-container {
  width: max-content;
  display: flex;
  align-items: center;
  gap: 2em !important;
  padding: 4px;
  border-radius: 30px;
  padding-left: 8px;
}

.btn-container {
  width: max-content;
  display: flex;
  align-items: center;
  gap: 1em;
  background-color: #2c2929;
  padding: 4px;
  border-radius: 30px;
  padding-left: 8px;
}

.btn-register {
  border-radius: 30px;
  color: #2c2121;
  border: none;
}

.btn-login {
  color: #ffffff !important;
}

.right-container {
  display: flex;
  align-items: center;
  gap: 1em;
}

.logo-container {
  display: flex;
  align-items: center;
}
@media screen and (max-width: 425px) {
  .btn-container {
    width: 220px !important;
    gap: 4px;
  }
  :deep(.btn-login) {
    padding: 0 !important;
    margin: 0 !important;
    font-size: 12px !important;
  }
  :deep(.btn-register) {
    font-size: 12px !important;
    padding: 0 !important;
  }
}
@media screen and (max-width: 1360px) {
  .el-header {
    padding-left: 10px;
    padding-right: 10px;
  }
  .logo-text {
    display: none;
  }
}
</style>
