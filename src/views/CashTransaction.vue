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
            <el-input v-model="account_number" placeholder="Enter Account Number" />
            <el-input v-model="amount" placeholder="Enter Amount" />
            <el-button @click="CashIn">Cash In</el-button>
          </form>
        </template>
        <template v-slot:cashout>
          <form class="transaction-form">
            <el-input v-model="account_number" placeholder="Enter Account Number" />
            <el-input v-model="amount" placeholder="Enter Amount" />
            <el-button @click="CashOut">Cash Out</el-button>
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
import { useCreditStore } from '@/stores/creditStore'

const imageSrc = ref(new URL('/src/assets/gcash-logo.jpg', import.meta.url).href)

const creditStore = useCreditStore()

const account_number = ref<number | null>(null)
const amount = ref<number | null>(null)

const CashIn = () => {
  if (!amount.value || !account_number.value) {
    console.log('Please fill in all fields')
    return
  }

  if (amount.value < 100) {
    console.log('Minimum cashin is 100')
    return
  }

  creditStore.handleCashin(Number(amount.value), Number(account_number.value))

  resetTransactionFields()
}

const CashOut = () => {
  if (!amount.value || !account_number.value) {
    console.log('Please fill in all fields')
    return
  }

  if (amount.value < 100) {
    console.log('Minimum cashout is 100')
    return
  }

  if (amount.value > creditStore.getCurrentBalance) {
    console.log('Insufficient Balance')
    return
  }

  creditStore.handleCashout(Number(amount.value), Number(account_number.value))

  resetTransactionFields()
}

const resetTransactionFields = () => {
  account_number.value = null
  amount.value = null
}
</script>

<style scoped>
.cash-transaction-container {
  max-width: 1200px;
  margin: 0 auto;
}

.main-container {
  background-color: var(--primary-black);
  max-width: 800px;
  height: 100vh;
  margin: 0 auto;
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
</style>
