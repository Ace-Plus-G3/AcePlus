<template>
  <el-dialog
    v-model="dialogFormVisible"
    width="500"
    :before-close="handleClose"
    center
    align-center
    :modal="true"
    style="background-color: var(--primary-black); padding: 30px"
  >
    <template #header>
      <h3>Let's get started</h3>
    </template>
    <el-tabs v-model="activeTab" @tab-click="handleClick" stretch>
      <p>You can choose if you want to login with email or phone number</p>
      <el-tab-pane label="Mobile Phone Number" name="first">
        <el-form :model="signupForm" label-position="top" style="color: yellow">
          <el-form-item>
            <el-input
              :prefix-icon="Flag"
              v-model="signupForm.phoneNumber"
              autocomplete="off"
              value="+63"
              placeholder="e.g. 9162819251"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              type="password"
              v-model="signupForm.password"
              autocomplete="off"
              placeholder="Password"
              show-password
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Email" name="second">
        <el-form :model="signupForm" label-position="top" style="color: yellow">
          <el-form-item>
            <el-input
              v-model="signupForm.email"
              autocomplete="off"
              placeholder="e.g. john@example.com"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="signupForm.password"
              autocomplete="off"
              type="password"
              placeholder="Password"
              show-password
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button> Create Account </el-button>
        <div class="terms-of-service-container">
          <el-checkbox> </el-checkbox>
          <p>
            Agree to Terms of Service
            <span>
              <router-link to="/terms-of-service"> View Terms of Service</router-link>
            </span>
          </p>
        </div>
        <div class="">
          <router-link to="/login">Login</router-link>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import type { TabsPaneContext } from 'element-plus'
import { Flag } from '@element-plus/icons-vue'

const activeTab = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

// Props to control visibility via v-model
const props = defineProps<{
  modelValue?: boolean
}>()

// Emits for v-model and form submission
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// Local state for form visibility
const dialogFormVisible = ref(props.modelValue)

// Sync dialogVisible changes to parent
watch(dialogFormVisible, (newValue) => {
  emit('update:modelValue', newValue)
})

// Sync parent prop changes to dialogVisible
watch(
  () => props.modelValue,
  (newValue) => {
    dialogFormVisible.value = newValue ?? false
  },
  { immediate: true },
)

const handleClose = (done: () => void) => {
  //   formRef.value?.resetFields()
  dialogFormVisible.value = false
  done()
}

// Form state
//const formRef = ref<FormInstance>()
const signupForm = ref({
  email: '',
  phoneNumber: '',
  password: '',
})
</script>

<style scoped>
.el-dialog h3 {
  color: white;
  margin: 20px;
}

.el-dialog p {
  font-size: 0.75rem;
  margin-block: 10px;
}

:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

:deep(.is-active) {
  color: white;
}

:deep(.el-tabs__item):hover {
  color: white;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--primary-yellow);
}

:deep(.el-input__wrapper) {
  border-radius: 5px;
  padding: 10px;
}

:deep(.el-form-item__label) {
  color: white;
  border-radius: 20px;
}

[data-v-4e698054] .el-button {
  width: 100%;
  padding: 20px;
  background-color: var(--primary-yellow);
  border: none;
  border-radius: 20px;
  color: white;
}

.terms-of-service-container {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 5px;
  padding-block: 10px;
}

.terms-of-service-container a {
  text-decoration: underline;
}
</style>
