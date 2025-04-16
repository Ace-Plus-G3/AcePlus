<template>
  <div id="home-page">
    <div class="title-container">
      <h1 class="title">Ace+</h1>
    </div>
    <div class="btn-container">
      <button v-if="!isLoggedIn" class="btn btn-play-not-log">Play Now</button>
      <!-- Add a conditional rendering for this buttons if the user logged -->
      <template v-if="isLoggedIn">
        <button class="btn btn-start">Start</button>
        <button class="btn btn-instructions">Instructions</button>
        <button class="btn btn-wallet">Wallet</button>
        <button @click="usePlayerStore().handleLogout" class="btn btn-logout">Logout</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/playerStore'

const playerStore = usePlayerStore()

const isLoggedIn = !!playerStore.getToken
</script>

<style scoped>
#home-page {
  height: 100vh;
  background-image: url(../assets/homepage_bg.png);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 67px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.title {
  font-family: 'Lemon', sans-serif;
  font-size: 170px;
  color: #f9c80e;
}

.btn-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.btn-play-not-log {
  width: 200px;
  height: 60px;
  border-radius: 30px;
  background-color: #e7bb68;
}

.btn {
  width: 200px;
  height: 60px;
  border-radius: 30px;
  background-color: #e7bb68;
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
