<template>
  <el-container>
    <div class="main-container">
      <HeaderComponent />
      <div class="image-container">
        <el-image :src="imageSrc" fit="contain" alt="Responsive Image" class="responsive-image" />
      </div>
      <div class="cash-transaction-container">
        <TabsComponent>
          <template v-slot:cashin>
            <form class="transaction-form">
              <el-input
                v-model="account_number"
                placeholder="Enter Account Number"
                type="number"
                class="phone-number-input"
              />
              <el-input
                v-model="amount"
                placeholder="Enter Amount"
                type="number"
                class="amount-input"
              />
              <el-button @click="CashIn">Cash In</el-button>
            </form>
          </template>
          <template v-slot:cashout>
            <form class="transaction-form">
              <el-input
                v-model="account_number"
                placeholder="Enter Account Number"
                type="number"
                class="phone-number-input"
              />
              <el-input
                v-model="amount"
                placeholder="Enter Amount"
                type="number"
                class="phone-number-input"
              />
              <el-button @click="CashOut">Cash Out</el-button>
            </form>
          </template>
        </TabsComponent>
      </div>
    </div>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HeaderComponent from '@/components/HeaderComponent-Latest.vue';
import TabsComponent from '@/components/TabsComponent.vue';
import { ElLoading } from 'element-plus';
import { useCreditStore, useDialogStore } from '@/stores';

const imageSrc = ref(new URL('/src/assets/gcash-logo.png', import.meta.url).href);

const dialogStore = useDialogStore();
const creditStore = useCreditStore();

const account_number = ref<number | null>(null);
const amount = ref<number | null>(null);

const CashIn = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  if (!amount.value || !account_number.value) {
    dialogStore.showDialog('error', 'Please fill in all fields');
    loading.close();
    return;
  }

  if (amount.value < 100) {
    dialogStore.showDialog('error', 'Minimum cash-in is 100');
    loading.close();
    return;
  }

  setTimeout(() => {
    creditStore.handleCashin(Number(amount.value), Number(account_number.value));
    dialogStore.showDialog('success', 'Transaction completed successfully!');
    resetTransactionFields();
    loading.close();
  }, 2000);
};

const CashOut = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  if (!amount.value || !account_number.value) {
    dialogStore.showDialog('error', 'Please fill in all fields');
    loading.close();
    return;
  }

  if (amount.value < 100) {
    dialogStore.showDialog('error', 'Minimum cash-out is 100');
    loading.close();
    return;
  }

  if (amount.value > creditStore.getCurrentBalance) {
    dialogStore.showDialog('error', 'Insufficient Balance');
    loading.close();
    return;
  }

  setTimeout(() => {
    creditStore.handleCashout(Number(amount.value), Number(account_number.value));
    dialogStore.showDialog('success', 'Transaction completed successfully!');
    resetTransactionFields();
    loading.close();
  }, 2000);
};

const resetTransactionFields = () => {
  account_number.value = null;
  amount.value = null;
};
</script>

<style scoped>
.el-container {
  width: 100%;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/homepage_bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.cash-transaction-container {
  max-width: 1200px;
  margin: 0 auto;
}

.main-container {
  background-color: var(--primary-black);
  max-width: 800px;
  width: 800px;
  height: 100dvh;
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

:deep(.amount-input input::-webkit-outer-spin-button),
:deep(.amount-input input::-webkit-inner-spin-button),
:deep(.phone-number-input input::-webkit-outer-spin-button),
:deep(.phone-number-input input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

:deep(.el-tabs__active-bar) {
  background-color: #e7bb68;
}

:deep(.el-tabs__item.is-active) {
  color: #f9c80e;
  font-family: 'Lemon', sans-serif;
}

:deep(.el-input__wrapper) {
  background-color: #474747;
  border-radius: 8px;
  padding: 16px;
  box-shadow: none;
}

:deep(.el-input__inner) {
  color: #ffffff;
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
