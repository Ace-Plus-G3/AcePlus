<template>
  <el-header>
    <div class="logo-container">
      <el-image :src="Logo" />
      <h3>ACE+</h3>
    </div>
    <div class="right-container">
      <Wallet />
      <div class="btn-container">
        <el-button link class="btn-login">Login</el-button>
        <el-button class="gold-bg btn-register">Register</el-button>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import Wallet from '@/assets/svg/wallet_svg.vue'
import Logo from '@/assets/logo_new.png'
</script>

<style scoped>
.el-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* padding-inline: 96px; */
  padding: 45px 96px 45px 96px;
}

.logo-container h3 {
  color: #f9c80e;
  font-size: 36px;
}

:deep(.el-button) {
  margin: 0 !important;
  font-family: 'Poppins', sans-serif !important;
}

.btn-container {
  display: flex;
  align-items: center;
  gap: 1em;
  background-color: #2c2929;
  padding: 4px;
  border-radius: 30px;
  padding-left: 8px;
}

.btn-register {
  border-radius: 30px;
  color: #2c2121;
  border: none;
}

.btn-login {
  color: #ffffff !important;
}

.right-container {
  display: flex;
  align-items: center;
  gap: 1em;
}

.logo-container {
  display: flex;
  align-items: center;
}
</style>
