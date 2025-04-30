<template>
  <el-container>
    <HeaderComponent />
    <div class="main-container" style="">
      <div class="title-container">
        <el-image :src="Star" class="star" />
        <h1>ACE+</h1>
        <h5>Banker Game Plus</h5>
        <p>But on highest card and win up to billions</p>
        <div class="btn-container">
          <el-button class="gold-bg">Play Now!</el-button>
          <el-button class="gold-bg">Instructions</el-button>
        </div>
      </div>
      <CardHomeView v-for="item in 5" :key="item" :index="item" />
    </div>
  </el-container>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import Star from '@/assets/invite_star.png'
import CardHomeView from '@/components/CardHomeView.vue'
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin-top: 4em;
}

.title-container {
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
    font-size: 128px;
    color: #f9c80e;
    text-shadow: 4px 4px 15px rgba(125, 31, 34, 0.72);
  }

  h5 {
    font-size: 38px;
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
</style>
