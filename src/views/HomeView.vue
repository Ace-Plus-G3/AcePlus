<template>
  <el-container>
    <HeaderComponent />
    <div id="home-page">
      <div class="left">
        <el-image :src="Star" class="star" />
        <h1>ACE+</h1>
        <h5>Banker Game Plus</h5>
        <p>But on highest card and win up to billions</p>
        <div class="btn-container">
          <el-button class="gold-bg">Play Now!</el-button>
          <el-button class="gold-bg">Instructions</el-button>
        </div>
      </div>
      <div class="right">
        <el-image :src="RoulleteLeft" class="roullete" />
        <el-image :src="RoulleteRight" class="roullete" />
      </div>
      <div class="card-main-container">
        <CardHomeView />
      </div>
    </div>
  </el-container>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import RoulleteLeft from '@/assets/roullete/roullete-left.png'
import RoulleteRight from '@/assets/roullete/roullete-right.png'
import Star from '@/assets/invite_star.png'
import CardHomeView from '@/components/CardHomeView.vue'
</script>

<style scoped>
.el-container {
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  background: linear-gradient(90deg, rgba(10, 10, 10, 1) 0%, rgba(50, 50, 50, 1) 50%);
}

.card-main-container {
  display: flex;
  position: absolute;
  top: 51%;
}

.btn-container {
  padding-top: 7%;
}

.star {
  position: absolute;
  right: 53%;
  top: -3%;
  z-index: 100 !important;
  width: 200px;
  height: 200px;
}

.right {
  display: flex;
  gap: 50em;
  position: relative;
}

.roullete {
  width: 350px;
  height: 350px;
  opacity: 0.25;
}

.left {
  text-align: center;
  padding-top: 2%;
}

.left p {
  font-size: 14px;
  color: #6c6c6c;
  font-family: 'Poppins', sans-serif;
}

.left h1 {
  font-size: 128px;
  color: #f9c80e;
  text-shadow: 4px 4px 15px rgba(125, 31, 34, 0.72);
}

.left h5 {
  font-size: 38px;
  color: #f9c80e;
  text-shadow: 4px 4px 15px rgba(125, 31, 34, 0.72);
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

#home-page {
  position: relative;
  overflow: hidden !important;
  height: 90.5dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 45px;
}
</style>
