<template>
  <el-header>
    <div class="left-header">
      <img class="logo" src="../assets/ace_logo.png" alt="" />
    </div>
    <div class="credit-container">
      <div class="bg-credit"></div>
    </div>
    <div class="right-header">
      <button class="btn-login">Login</button>
      <button class="btn-register">Register</button>
    </div>
  </el-header>
</template>

<script setup lang="ts"></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lemon&display=swap');
.logo {
  width: 114px;
  height: 50px;
}

.el-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #0a0a0a;
  align-items: center;
  padding-left: 7%;
  padding-right: 7%;
  box-shadow: 2px 5px 5px 0px rgba(46, 46, 46, 0.59);
  padding-top: 12px;
  padding-bottom: 7px;
}

.btn-login:hover,
.btn-register:hover {
  scale: 1.1;
  cursor: pointer;
}

.btn-login {
  width: 104px;
  height: 32px;
  border-radius: 20px;
  color: #ffffff;
  font-family: 'Lemon', sans-serif;
  background-color: #e5938c;
  border: 1px solid #e7bb68;
}

.btn-register {
  width: 104px;
  height: 32px;
  background-color: #e7bb68;
  color: white;
  font-family: 'Lemon', sans-serif;
  border-radius: 20px;
}

.right-header {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

@media screen and (min-width: 320px) and (max-width: 680px) {
  .el-header {
    display: flex;
    padding-left: 20px;
    padding-right: 20px;
  }
  .logo {
    width: 114px;
    height: 50px;
  }

  .left-header {
    margin-top: 10px;
  }

  .btn-login {
    width: 78px;
    height: 29px;
  }

  .btn-register {
    display: none;
  }
}
</style>
