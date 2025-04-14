<template>
  <div class="carousel-container">
    <el-carousel height="200px" autoplay class="carousel-item-container">
      <el-carousel-item> </el-carousel-item>
      <el-carousel-item> </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.carousel-container {
  padding-left: 60px;
  padding-right: 60px;
  padding-top: 40px;
}

/* :deep(.el-carousel) {
  height: 500px;
} */

.carousel-item-container {
  border-radius: 20px;
  box-shadow: 2px 5px 5px 0px rgba(32, 32, 32, 0.59);
}

.el-carousel__item:nth-child(2n) {
  background-image: url(../assets/banner_1.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.el-carousel__item:nth-child(2n + 1) {
  background-image: url(../assets/banner_2.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

:deep(.el-carousel__button) {
  background-color: #e7bb68;
  height: 4px;
  width: 50px;
}

@media screen and (min-width: 320px) and (max-width: 680px) {
  .carousel-item-container {
    width: 100%;
    /* height: 200px; */
  }
  .carousel-container {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
  }
}

/* @media screen and (min-width: 681px) {
  .carousel-item-container {
    height: 300px;
  }
} */
</style>
