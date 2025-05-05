<template>
  <div id="ReceiptView">
    <HeaderComponent />
    <div class="card-container">
      <div class="left">
        <div class="left-row-container"><ReceiptSVG /></div>
      </div>
      <div class="right">
        <div class="right-row-container">
          <div class="right-row-item">
            <h4>Amount</h4>
            <h4 class="amount" :style="{ color: transactionType === 'Cash- In' ? 'green' : 'red' }">
              {{ transactionType === 'Cash- In' ? '+' : '-' }}
              <span :style="{ color: transactionType === 'Cash- In' ? 'green' : 'red' }">{{
                formatCurrency(transaction?.amount ? transaction.amount : 0)
              }}</span>
            </h4>
          </div>
          <div class="right-row-item">
            <h4>Date</h4>
            <h4>{{ moment(transaction?.date).format('MMMM Do YYYY') }}</h4>
          </div>
          <div class="right-row-item">
            <h4>Time</h4>
            <h4>{{ moment(transaction?.date).format('h:mm a') }}</h4>
          </div>
          <div class="reference-container">
            <h4 class="ref">Reference Number</h4>
            <h4 class="transact-id">
              <span class="copy"><CopySVG @click="copyToClipBoard" class="svg_copy" /></span
              ><span ref="textToCopy">{{ transaction?.transaction_id }}</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCreditStore } from '@/stores'
import HeaderComponent from '@/components/HeaderComponent-Latest.vue'
import ReceiptSVG from '@/assets/svg/receipt_svg.vue'
import CopySVG from '@/assets/svg/copy_svg.vue'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { formatCurrency } from '@/utils/convertMoney'
import type { Transaction } from '@/models/type'

const route = useRoute()
const creditStore = useCreditStore()
const transactionId = computed(() => String(route.params.id))
const transactionType = computed(() => String(route.params.type))
const transaction = ref<Transaction | undefined>(undefined)

watch(
  transactionId,
  (newId) => {
    if (transactionType.value === 'Cash- In') {
      const fetchTransaction = creditStore.getCashinTransacById(newId)
      transaction.value = fetchTransaction
    } else if (transactionType.value === 'Cash- Out') {
      const fetchTransaction = creditStore.getCashoutTransacById(newId)
      transaction.value = fetchTransaction
    }
  },
  { immediate: true },
)

const textToCopy = ref(transactionId)

const copyToClipBoard = () => {
  if (textToCopy.value) {
    navigator.clipboard
      .writeText(textToCopy.value)
      .then(() => {
        ElMessage({
          message: 'Text Copied',
          type: 'success',
        })
      })
      .catch((err) => {
        console.error('failed', err)
        ElMessage({
          message: 'Copying Text Failed!',
          type: 'error',
        })
      })
  }
}
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .card-container {
    padding: 0px !important;
  }
  .transact-id {
    text-align: right !important;
  }
  .copy {
    margin-right: 5px;
  }
}

* {
  color: white;
}

.copy {
  margin-right: 10px;
}

.svg_copy:hover {
  scale: 1.1;
  cursor: pointer;
}

span {
  color: #42f271;
}

.amount {
  color: red;
}

.reference-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 10px;
  font-size: 10px;
}

.ref {
  color: #c5c5c5;
}

.right-row-container {
  padding: 15px;
  gap: 15px;
  display: flex;
  flex-direction: column;
}

.right-row-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
}

#ReceiptView {
  background-color: var(--primary-black);
  max-width: 800px;
  height: 100dvh;
  margin: 0 auto;
}

.left-row-container {
  border-bottom: 1px solid #c5c5c5;
  display: flex;
  justify-content: center;
  padding: 32px 96px 32px 96px;
}

.card-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 736px;
  max-height: 344px;
  padding: 32px;
}
</style>
