<template>
  <el-header>
    <div class="back-container">
      <el-icon @click="goToBack" :size="30" :color="'var(--primary-yellow)'">
        <Back />
      </el-icon>
    </div>
    <div>
      <div class="text">
        <h3 @click="goToTransact">E - Wallet</h3>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { Back } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToBack = () => {
  // router.push({ name: 'home' })
  router.back();
};

const goToTransact = () => {
  router.push({ name: 'transaction-history' });
};
</script>

<style scoped>
.el-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: var(--primary-black);
  align-items: center;
  padding-top: 4px;
  padding-bottom: 3px;
}

.text {
  display: flex;
  font-family: 'Lemon', sans-serif;
}

.text h3 {
  color: #f9c80e;
}

.text h3:hover {
  cursor: pointer;
}

.line {
  width: 25px;
  height: 3px;
  background-color: var(--primary-yellow);
}

.back-container:hover {
  cursor: pointer;
  transform: scale(1.1);
  transition: all 0.3s ease-in-out;
}
</style>
