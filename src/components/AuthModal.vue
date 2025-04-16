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
    <el-tabs v-model="activeTab" @tab-click="handleClick" stretch>
      <el-tab-pane label="Sign up" name="first">
        <el-form
          :model="signupForm"
          :rules="rules"
          ref="signupFormRef"
          label-position="top"
          style="color: yellow"
        >
          <el-form-item prop="phoneNumber">
            <el-input
              :prefix-icon="Flag"
              v-model="signupForm.phoneNumber"
              autocomplete="off"
              placeholder="09xxxxxxxxx"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="signupForm.password"
              autocomplete="off"
              placeholder="Password"
              show-password
            />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="signup()"> Create Account </el-button>
            <div class="terms-of-service-container">
              <el-checkbox> </el-checkbox>
              <p>
                Agree to Terms of Service
                <span>
                  <router-link to="/terms-of-service"> View Terms of Service</router-link>
                </span>
              </p>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Login" name="second">
        <el-form :model="loginForm" ref="loginFormRef" label-position="top" style="color: yellow">
          <el-form-item>
            <el-input
              :prefix-icon="Flag"
              v-model="loginForm.phoneNumber"
              autocomplete="off"
              placeholder="09xxxxxxxxx"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="loginForm.password"
              autocomplete="off"
              type="password"
              placeholder="Password"
              show-password
            />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="login()"> Login </el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import type { FormInstance, FormRules } from 'element-plus'

import type { TabsPaneContext } from 'element-plus'
import { Flag } from '@element-plus/icons-vue'

import { usePlayerStore } from '@/stores'

const store = usePlayerStore()

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

const rules = ref<FormRules>({
  phoneNumber: [{ required: true, message: 'Please enter your mobile number', trigger: 'blur' }],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
})

// Signup Form state
const signupFormRef = ref<FormInstance>()

const signupForm = ref({
  phoneNumber: '',
  password: '',
})

const signup = async () => {
  await store.handleSignup(signupFormRef.value)
}

// Login Form state
const loginFormRef = ref<FormInstance>()

const loginForm = ref({
  phoneNumber: '',
  password: '',
})

const login = async () => {
  console.log('clicked')
  await store.handleLogin(loginFormRef.value).then(() => {
    dialogFormVisible.value = false
  })
}
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
  border-radius: 8px;
  padding: 10px;
}

:deep(.el-form-item__label) {
  color: white;
  border-radius: 20px;
}

:deep(.el-button) {
  width: 100%;
  padding: 20px;
  background-color: var(--primary-yellow);
  border: none;
  border-radius: 20px;
  color: var(--primary-black);
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
