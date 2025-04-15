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
  width: 90%;
  max-width: 1200px;
  height: 380px;
  background-color: #d9d9d9;
  border-radius: 20px;
  margin: 40px auto;
  padding: 20px;
  /* background-image: url(''); */
  background-size: cover;
  background-position: center;
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
    /* background-image: url(''); */
  }
  .play-btn {
    width: 115px;
    height: 31px;
    background-color: #e7bb68;
    border-radius: 20px;
  }
}
</style>
