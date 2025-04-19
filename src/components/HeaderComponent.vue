<template>
  <el-header>
    <div class="back-container">
      <el-icon @click="goToBack" :size="30" :color="'var(--primary-yellow)'">
        <Back />
      </el-icon>
    </div>
    <div>
      <div class="hamburger">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { Back } from '@element-plus/icons-vue'
import {useRouter} from 'vue-router'

const router = useRouter()

const goToBack = () => {
  router.push({name: 'home'})
}
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

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.line {
  width: 25px;
  height: 3px;
  background-color: var(--primary-yellow);
}
</style>
