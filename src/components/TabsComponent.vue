<template>
  <el-tabs v-model="activeName" class="demo-tabs" stretch>
    <el-tab-pane label="Cash-In" name="first">
      <slot name="cashin"></slot>
    </el-tab-pane>
    <el-tab-pane label="Cash-Out" name="second">
      <slot name="cashout"></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeName = ref('first')
</script>
