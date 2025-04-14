<template>
  <div class="game-section-container"></div>
  <div class="play-btn-container">
    <button class="play-btn">PLAY</button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.play-btn-container {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.game-section-container {
  /* width: 950px;
  height: 350px; */
  background-color: #d9d9d9;
  border-radius: 20px;
  /* margin-left: 20%;
  margin-right: 20%;
  margin-top: 40px; */
}

.play-btn:hover {
  scale: 1.1;
}

.play-btn {
  width: 130px;
  height: 37px;
  background-color: #e7bb68;
  border-radius: 20px;
}

@media screen and (min-width: 320px) and (max-width: 680px) {
  .game-section-container {
    height: 431px;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 40px;
  }
  .play-btn {
    width: 115px;
    height: 31px;
    background-color: #e7bb68;
    border-radius: 20px;
  }
}
</style>
