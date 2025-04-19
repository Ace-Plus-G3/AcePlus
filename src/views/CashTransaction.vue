<template>
  <div class="main-container">
    <HeaderComponent />
    <div class="image-container">
      <el-image :src="imageSrc" fit="contain" alt="Responsive Image" class="responsive-image" />
    </div>
    <div class="cash-transaction-container">
      <TabsComponent>
        <template v-slot:cashin>
          <form class="transaction-form">
            <el-input placeholder="Enter Account Number" />
            <el-input placeholder="Enter Amount" />
            <el-button>Cash In</el-button>
          </form>
        </template>
        <template v-slot:cashout>
          <form class="transaction-form">
            <el-input placeholder="Enter Account Number" />
            <el-input placeholder="Enter Amount" />
            <el-button>Cash Out</el-button>
          </form>
        </template>
      </TabsComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import TabsComponent from '@/components/TabsComponent.vue'

const imageSrc = ref(new URL('/src/assets/gcash-logo.jpg', import.meta.url).href)
</script>

<style scoped>
.cash-transaction-container {
  max-width: 1200px;
  margin: 0 auto;
}

.main-container {
  background-color: var(--primary-black);
  height: 100vh;
}

.image-container {
  width: 100%;
  padding: 16px;
  max-width: 400px;
  margin: 0 auto;
}

.responsive-image {
  width: 100%;
  height: auto;
  display: block;
}

.transaction-form {
  max-width: 425px;
  margin: 0 auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(.el-input__wrapper) {
  background-color: #474747;
  border-radius: 8px;
  padding: 16px;
  box-shadow: none;
}

:deep(.el-button) {
  background-color: var(--primary-yellow);
  color: var(--primary-black);
  border: none;
  border-radius: 40px;
  padding: 24px;
}
</style>
