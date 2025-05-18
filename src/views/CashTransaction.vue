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
            <el-form class="transaction-form" :rules="rules" :model="Form" ref="FormRef">
              <el-form-item prop="account_number">
                <el-input
                  v-model="Form.account_number"
                  placeholder="Enter Account Number"
                  type="number"
                  class="phone-number-input"
                />
              </el-form-item>
              <el-form-item prop="Cashinamount">
                <el-input
                  v-model.number="Form.Cashinamount"
                  placeholder="Enter Amount"
                  type="number"
                  class="amount-input"
                />
              </el-form-item>
              <el-button class="gold-bg" @click="openTransactionDialog('Cash-in')"
                >Cash In</el-button
              >
            </el-form>
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
              <el-button class="gold-bg" @click="openTransactionDialog('Cash-out')"
                >Cash Out</el-button
              >
            </form>
          </template>
        </TabsComponent>
      </div>
    </div>
    <div>
      <el-dialog
        v-model="transactionDialogVisible"
        :title="`Confirm ${transactionType}`"
        width="auto"
        style="max-width: 350px"
      >
        <span>Are you sure you want to {{ transactionType.toLowerCase() }} this amount?</span>
        <template #footer>
          <el-button class="cancel-btn" @click="transactionDialogVisible = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="confirmTransaction(transactionType)">
            Confirm
          </el-button>
        </template>
      </el-dialog>
    </div>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HeaderComponent from '@/components/HeaderComponent-Latest.vue';
import TabsComponent from '@/components/TabsComponent.vue';
import { ElLoading, type FormInstance, type FormRules } from 'element-plus';
import { useCreditStore, useDialogStore } from '@/stores';

const imageSrc = ref(new URL('/src/assets/gcash-logo.png', import.meta.url).href);

const dialogStore = useDialogStore();
const creditStore = useCreditStore();

const account_number = ref<number | null>(null);
const amount = ref<number | null>(null);

const transactionType = ref<string>('');
const transactionDialogVisible = ref(false);

const openTransactionDialog = (type: string) => {
  transactionDialogVisible.value = true;
  transactionType.value = type;
};

const confirmTransaction = (transactionType: string) => {
  transactionDialogVisible.value = false;
  if (transactionType === 'Cash-in') {
    CashIn();
  } else if (transactionType === 'Cash-out') {
    CashOut();
  }
};

const CashIn = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  FormRef.value?.validate((valid) => {
    if (!valid) {
      loading.close();
      return;
    }
    setTimeout(() => {
      creditStore.handleCashin(Number(Form.value.Cashinamount), Number(Form.value.account_number));
      dialogStore.showDialog('success', 'Cash-in transaction completed successfully!');
      resetTransactionFields();
      loading.close();
    }, 2000);
  });
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
    dialogStore.showDialog('success', 'Cash-out t ransaction completed successfully!');
    resetTransactionFields();
    loading.close();
  }, 2000);
};

const rules = <FormRules>{
  account_number: [
    { required: true, message: 'Please enter your account number', trigger: 'blur' },
    { min: 11, max: 11, message: 'Account Number must be 11 digits', trigger: 'blur' },
    {
      pattern: /^09\d{9}$/,
      message: 'Account Number must start with 09 and be 11 digits',
      trigger: 'blur',
    },
  ],
  Cashinamount: [
    { required: true, message: 'Please enter an amount', trigger: 'blur' },
    { type: 'number', min: 50, message: 'Minimum amount is 50', trigger: 'blur' },
  ],
  Cashoutamount: [
    { required: true, message: 'Please enter an amount', trigger: 'blur' },
    {
      type: 'number',
      max: creditStore.getCurrentBalance,
      message: 'Amount exceeds current balance',
      trigger: 'blur',
    },
    { type: 'number', min: 50, message: 'Minimum amount is 100', trigger: 'blur' },
  ],
};

const FormRef = ref<FormInstance>();
const Form = ref({
  account_number: '',
  Cashinamount: '',
  Cashoutamount: '',
});

const resetTransactionFields = () => {
  // account_number.value = null;
  // amount.value = null;
  FormRef.value?.resetFields();
  FormRef.value?.resetFields();
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
  gap: 2px;
}

.cancel-btn {
  background-color: transparent !important;
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
  border: none !important;
}

:deep(.el-button):hover {
  scale: 1.1;
  cursor: pointer;
}
</style>
