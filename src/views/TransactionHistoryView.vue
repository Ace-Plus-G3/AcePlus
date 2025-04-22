<template>
  <div id="transact-history">
    <HeaderComponent />
    <div class="card-amount-main-container">
      <div class="card-amount-container">
        <div class="left-amount">
          <h5>AVAILABLE BALANCE</h5>
          <h3><span>₱</span>{{ useCreditStore().getCurrentBalance }}</h3>
        </div>
        <div class="right-amount">
          <el-button @click="goToCashTransact" :icon="Plus">Cash In</el-button>
          <el-button @click="goToCashTransact" :icon="Minus">Cash Out</el-button>
        </div>
      </div>
    </div>
    <div class="transact-history-container">
      <h3 class="title-text">Transaction History</h3>
    </div>
    <!-- <div class="tab-container"> -->
    <TabsComponent>
      <template v-slot:cashin>
        <div class="history-item-container">
          <div
            @click="goToReciept(transaction.transaction_id, transaction.type)"
            v-for="transaction in creditStore.cashin"
            :key="transaction.user_id"
            class="row-container"
          >
            <div class="left-cashin">
              <h4>{{ moment(transaction.date).format('h:mm:ss a') }}</h4>
              <h3>{{ transaction.type }}</h3>
              <h4>{{ moment().format('MMMM Do YYYY') }}</h4>
            </div>
            <div class="right-cashin">
              <h3><span>₱</span>{{ transaction.amount }}</h3>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:cashout>
        <div class="history-item-container">
          <div
            @click="goToReciept(transaction.transaction_id, transaction.type)"
            class="row-container"
            v-for="transaction in creditStore.cashout"
            :key="transaction.user_id"
          >
            <div class="left-cashout">
              <h4>{{ moment(transaction.date).format('h:mm:ss a') }}</h4>
              <h3>{{ transaction.type }}</h3>
              <h4>{{ moment().format('MMMM Do YYYY') }}</h4>
            </div>
            <div class="right-cashout">
              <h3><span>₱</span><span>-</span>{{ transaction.amount }}</h3>
            </div>
          </div>
        </div>
      </template>
    </TabsComponent>
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import moment from 'moment'

import { Plus, Minus } from '@element-plus/icons-vue'
import TabsComponent from '@/components/TabsComponent.vue'
import { useRouter } from 'vue-router'
import { useCreditStore } from '@/stores/creditStore'

const creditStore = useCreditStore()

const goToReciept = (transaction_id: string, transaction_type: 'Cash- In' | 'Cash- Out') => {
  router.push({ name: 'receipt', params: { id: transaction_id, type: transaction_type } })
}

const router = useRouter()

const goToCashTransact = () => {
  router.push({ name: 'cash-transaction' })
}

// const dateTimeString = creditStore
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .card-amount-main-container {
    padding-left: 13px;
    padding-right: 13px;
  }

  .history-item-container {
    display: flex;
    flex-direction: column;
  }

  .left-cashin h3,
  .left-cashout h3 {
    font-size: 30px;
    font-weight: normal;
  }

  .left-cashin h4,
  .left-cashout h4 {
    font-size: 10px;
  }

  .left-cashin,
  .left-cashout {
    gap: 8px;
  }

  .left-amount h5 {
    font-size: 8px !important;
    font-weight: 400 !important;
  }

  .left-amount h3 {
    font-size: 20px !important;
  }

  /* .transact-history-container {
      max-width: 680px;
    } */

  .el-button {
    font-size: 12px;
  }

  .left-amount h3 {
    letter-spacing: 2px;
  }

  .left-amount {
    color: var(--primary-black);
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .left-cashin,
  .left-cashout {
    display: flex;
    flex-direction: column;
  }

  .row-container {
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 10px;
    padding-bottom: 15px;
  }

  /* :deep(.el-tabs__nav) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  } */

  :deep(.el-tabs__header) {
    margin: 10px 0px 16px !important;
  }

  :deep(.el-tabs__item.is-active) {
    font-size: 13px;
  }

  .title-text {
    font-size: 24px;
    margin-top: 15px;
  }

  .row-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between !important;
    gap: 0px !important;
    padding: 10px 50px !important;
  }
  .el-tabs {
    margin-left: 0px !important;
    margin-right: 0px !important;
  }

  .card-amount-container {
    width: 90% !important;
    height: 140px !important;
    padding: 30px !important;
  }
  .history-item-container {
    max-height: 450px !important;
  }
}

.left-cashin h3 {
  font-size: 20px;
}

.el-tabs {
  margin-left: 20px;
  margin-right: 20px;
}

.el-button {
  color: var(--primary-black);
  border-radius: 10px;
  border: none;
}

.row-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.left-cashin h4,
.left-cashout h4 {
  color: #c5c5c5;
  font-size: 12px;
}

.left-cashin,
.left-cashout {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.right-cashin {
  display: flex;
  align-items: center;
  color: #42f271;
}
.right-cashout {
  display: flex;
  align-items: center;
  color: #ea3e27;
}

.history-item-container {
  color: #ffffffff;
}

.row-container {
  border-bottom: 1px solid #313131;
  padding: 32px;
}

:deep(.el-tabs__header) {
  margin: 10px 0px 16px !important;
}

:deep(.el-tabs__active-bar) {
  background-color: #e7bb68;
}

:deep(.el-tabs__item.is-active) {
  color: #f9c80e;
  font-family: 'Lemon', sans-serif;
}

.title-text {
  color: var(--primary-white);
  text-align: center;
}

#transact-history {
  background-color: var(--primary-black);
  font-family: 'Roboto', sans-serif !important;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 auto;
  /* background-image: url(../assets/homepage_bg.png); */
  height: 100vh;
}

/* .card-amount-main-container {
  display: none;
} */

.card-amount-main-container {
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
  overflow: hidden;
}

.card-amount-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  gap: 20px;
  background-color: #e8b839;
  background: linear-gradient(
    90deg,
    rgba(232, 184, 57, 1) 0%,
    rgba(232, 184, 57, 1) 35%,
    rgba(186, 129, 21, 1) 63%,
    rgba(251, 246, 127, 1) 82%,
    rgba(220, 188, 78, 1) 100%
  );
  border-radius: 10px;
  /* width: 100%;
  height: 150px; */
  /* padding: 60px; */
}

.card-amount-container {
  width: 400px;
  height: 161px;
  padding: 20px;
  overflow: hidden;
}

.left-amount h5 {
  font-size: 16px;
  font-weight: 400;
}

.left-amount h3 {
  font-size: 32px;
}

.history-item-container {
  max-height: 490px; /* Set the maximum height */
  overflow-y: auto; /* Enable vertical scrolling */
  padding: 0;
  scrollbar-width: none;
}
</style>
