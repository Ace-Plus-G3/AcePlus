<template>
  <el-header>
    <div class="logo-container">
      <el-image :src="Logo" class="logo" />
      <h3 class="logo-text">ACE+</h3>
    </div>
    <div class="btn-container">
      <el-button link class="btn-login">Login</el-button>
      <el-button class="gold-bg btn-register">Register</el-button>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import Logo from '@/assets/logo_new.png'
</script>

<style scoped>
.el-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 45px 96px 45px 96px;
}

.logo-container h3 {
  color: #f9c80e;
  font-size: 36px;
}

.logo {
  width: 80px;
  height: 80px;
  flex: 1;
  /* flex-shrink: 0; */
  /* flex-grow: 0; */
}

:deep(.el-button) {
  margin: 0 !important;
  font-family: 'Poppins', sans-serif !important;
}

.btn-container {
  width: max-content;
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
@media screen and (max-width: 425px) {
  .btn-container {
    width: 220px !important;
    gap: 4px;
  }
  :deep(.btn-login) {
    padding: 0 !important;
    margin: 0 !important;
    font-size: 12px !important;
  }
  :deep(.btn-register) {
    font-size: 12px !important;
    padding: 0 !important;
  }
}
@media screen and (max-width: 1360px) {
  .el-header {
    padding-left: 10px;
    padding-right: 10px;
  }
  .logo-text {
    display: none;
  }
}
</style>
