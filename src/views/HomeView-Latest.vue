<template>
  <div id="home-page">
    <div class="title-container">
      <h1 class="title">Ace+</h1>
    </div>
    <div class="btn-container">
      <el-button v-if="!usePlayerStore().getToken" @click="openModal" class="btn btn-play-not-log">
        <el-text> Play Now </el-text>
      </el-button>
      <!-- Add a conditional rendering for this buttons if the user logged -->
      <template v-if="usePlayerStore().getToken">
        <el-button @click="gotoGame" class="btn btn-start"><el-text>Start</el-text></el-button>
        <el-button @click="openTutorial" class="btn btn-instructions"
          ><el-text>Instructions</el-text></el-button
        >
        <el-button @click="goToWallet" class="btn btn-wallet"><el-text>Wallet</el-text></el-button>
        <el-button @click="logout()" class="btn btn-logout"><el-text>Logout</el-text></el-button>
      </template>
    </div>
  </div>
  <div>
    <AuthModal v-model="isModalVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { useRouter } from 'vue-router'
import AuthModal from '@/components/AuthModal.vue'
import { showNotify } from '@/utils/notify'

const router = useRouter()
const isModalVisible = ref(false)

const openTutorial = () => {
  router.push({ name: 'tutorial', query: { tutorial: 'true' } })
}

const openModal = () => {
  isModalVisible.value = true
}

const playerStore = usePlayerStore()

const gotoGame = () => {
  if (playerStore.isNewUser) {
    router.push({ name: 'tutorial', query: { tutorial: 'true' } })

    if (playerStore.getUser) {
      playerStore.setUser({
        ...playerStore.getUser,
        isNewUser: false,
      })

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...playerStore.getUser,
          isNewUser: false,
        }),
      )
    }
  } else {
    router.push({ name: 'game' })
  }
}

const goToWallet = () => {
  router.push('/transaction-history')
}

const logout = () => {
  usePlayerStore().handleLogout()
  showNotify({
    title: 'Success!',
    message: 'You have logout successfully.',
    type: 'success',
  })
}
</script>

<style scoped>
#home-page {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 67px;
}

.title {
  font-family: 'Lemon', sans-serif;
  font-size: 170px;
  background: linear-gradient(
    90deg,
    rgba(232, 184, 57, 1) 0%,
    rgba(232, 184, 57, 1) 35%,
    rgba(186, 129, 21, 1) 63%,
    rgba(251, 246, 127, 1) 82%,
    rgba(220, 188, 78, 1) 100%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-left: 0.1em;
}

.btn-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

:deep(.el-button) {
  margin: 0;
  width: 200px;
  height: 60px;
  border-radius: 30px;
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
}

:deep(.el-button):hover {
  scale: 1.1;
  cursor: pointer;
}

:deep(.el-text) {
  color: var(--primary-black);
}

@media screen and (min-width: 320px) and (max-width: 680px) {
  .title {
    font-size: 100px;
  }
  .btn {
    width: 180px;
    height: 50px;
  }
  .btn-container {
    gap: 15px;
  }
}
</style>
