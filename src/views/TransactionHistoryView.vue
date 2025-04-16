<template>
  <div id="transact-history">
    <HeaderComponent />
    <div class="card-amount-main-container">
      <div class="card-amount-container">
        <div class="left-amount">
          <h5>AVAILABLE BALANCE</h5>
          <h3><span>₱</span>6,456.13</h3>
        </div>
        <div class="right-amount">
          <el-button :icon="Plus">Cash In</el-button>
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
          <div class="row-container">
            <div class="left-cashin">
              <h3>Cash- In</h3>
              <h4>April 11, 2025</h4>
              <h4>123456789</h4>
            </div>
            <div class="right-cashin">
              <h3><span>₱</span>200</h3>
            </div>
          </div>
          <div class="row-container">
            <div class="left-cashin">
              <h3>Cash- In</h3>
              <h4>April 12, 2025</h4>
              <h4>123456789</h4>
            </div>
            <div class="right-cashin">
              <h3><span>₱</span>100</h3>
            </div>
          </div>
          <div class="row-container">
            <div class="left-cashin">
              <h3>Top- Up</h3>
              <h4>April 15, 2025</h4>
              <h4>123456789</h4>
            </div>
            <div class="right-cashin">
              <h3><span>₱</span>200</h3>
            </div>
          </div>
          <div class="row-container">
            <div class="left-cashin">
              <h3>Top- Up</h3>
              <h4>April 15, 2025</h4>
              <h4>123456789</h4>
            </div>
            <div class="right-cashin">
              <h3><span>₱</span>200</h3>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:cashout>
        <div class="history-item-container">
          <div class="row-container">
            <div class="left-cashout">
              <h3>Cash- Out</h3>
              <h4>April 11, 2025</h4>
              <h4>123456789</h4>
            </div>
            <div class="right-cashout">
              <h3><span>₱</span><span>-</span>200</h3>
            </div>
          </div>
          <div class="row-container">
            <div class="left-cashout">
              <h3>Cash- Out</h3>
              <h4>April 11, 2025</h4>
              <h4>123456789</h4>
            </div>
            <div class="right-cashout">
              <h3><span>₱</span><span>-</span>200</h3>
            </div>
          </div>
          <div class="row-container">
            <div class="left-cashout">
              <h3>Cash- Out</h3>
              <h4>April 12, 2025</h4>
              <h4>123456789</h4>
            </div>
            <div class="right-cashout">
              <h3><span>₱</span><span>-</span>100</h3>
            </div>
          </div>
          <div class="row-container">
            <div class="left-cashout">
              <h3>Cash- Out</h3>
              <h4>April 15, 2025</h4>
              <h4>123456789</h4>
            </div>
            <div class="right-cashout">
              <h3><span>₱</span><span>-</span>200</h3>
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

import { Plus } from '@element-plus/icons-vue'
import TabsComponent from '@/components/TabsComponent.vue'
</script>

<style scoped>
@media screen and (min-width: 320px) and (max-width: 680px) {
  .card-amount-container {
    width: 100%;
    height: 100px;
    background-color: #e7bb68;
    border-radius: 10px;
    padding: 30px;
  }

  .card-amount-main-container {
    padding-left: 13px;
    padding-right: 13px;
  }
  .history-item-container {
    display: flex;
    flex-direction: column;
  }
  .row-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .left-cashin h3,
  .left-cashout h3 {
    font-size: 18px;
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
    font-size: 8px;
    font-weight: 400;
  }
  .left-amount h3 {
    font-size: 20px;
  }
}

.transact-history-container {
  max-width: 680px;
}

.el-button {
  border-radius: 40px;
  font-size: 12px;
  color: var(--primary-black);
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

.card-amount-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.left-cashin h4,
.left-cashout h4 {
  color: #c5c5c5;
}

.left-cashin,
.left-cashout {
  display: flex;
  flex-direction: column;
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
  /* padding-left: 20px;
  padding-right: 20px; */
}

.row-container {
  border-bottom: 1px solid #313131;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 10px;
  padding-bottom: 15px;
}

:deep(.el-tabs__nav) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

:deep(.el-tabs__header) {
  margin: 10px 0px 16px !important;
}

:deep(.el-tabs__active-bar) {
  background-color: #e7bb68;
}

:deep(.el-tabs__item.is-active) {
  color: #ffffff;
  font-family: 'Lemon', sans-serif;
  font-size: 13px;
}

#transact-history {
  background-color: var(--primary-black);
  height: 100vh;
}

.title-text {
  font-size: 24px;
  color: var(--primary-white);
  text-align: center;
  margin-top: 15px;
}
</style>
