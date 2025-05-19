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
    <el-tabs v-model="activeTab" stretch>
      <el-tab-pane label="Login" name="Login-Tab">
        <el-form
          :model="loginForm"
          ref="loginFormRef"
          :rules="rules"
          label-position="top"
          style="color: yellow"
        >
          <el-form-item prop="phoneNumber">
            <el-input
              :prefix-icon="Flag"
              v-model="loginForm.phoneNumber"
              type="text"
              maxlength="11"
              show-word-limit
              autocomplete="off"
              placeholder="09xxxxxxxxx"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              autocomplete="off"
              type="password"
              placeholder="Password"
              show-password
            />
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="login()" :disabled="!isLoginFormValid" style="width: 100%">
              Login
            </el-button>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Sign up" name="Signup-Tab">
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
              type="text"
              maxlength="11"
              show-word-limit
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
          <el-form-item prop="confirmpassword">
            <el-input
              type="confirmpassword"
              v-model="signupForm.confirmpassword"
              autocomplete="off"
              placeholder="Confirm Password"
              show-password
            />
          </el-form-item>
          <div class="dialog-footer">
            <div class="terms-of-service-container">
              <el-checkbox v-model="isAgreeToTerms"> </el-checkbox>
              <p>
                Agree to Terms of Service
                <span>
                  <router-link to="/terms-of-service"> View Terms of Service</router-link>
                </span>
              </p>
            </div>
            <el-button @click="signup()" :disabled="!isSignupFormValid" style="width: 100%">
              Create Account
            </el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Flag } from '@element-plus/icons-vue';
import { usePlayerStore } from '@/stores';
import type { TLogin, TSignup } from '@/models/type';
import { showNotify } from '@/utils/notify';

const store = usePlayerStore();

// Props to control visibility via v-model
const props = defineProps<{ modelValue: boolean; activeTabValue: string }>();

// Emits for v-model
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'updateActiveTab:activeTabValue', value: string): void;
}>();

// Local state for form visibility and active tab
const dialogFormVisible = ref<boolean>(props.modelValue);
const activeTab = ref<string>(props.activeTabValue);

// Sync dialogVisible changes to parent
watch(dialogFormVisible, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(activeTab, (newValue) => {
  emit('updateActiveTab:activeTabValue', newValue);
});

// Sync parent prop changes to dialogVisible
watch(
  () => props.modelValue,
  (newValue) => {
    dialogFormVisible.value = newValue ?? false;
  },
  { immediate: true },
);

watch(
  () => props.activeTabValue,
  (newValue) => {
    activeTab.value = newValue ?? 'Signup-Tab';
  },
  { immediate: true },
);

const handleClose = (done: () => void) => {
  signupFormRef.value?.resetFields();
  loginFormRef.value?.resetFields();
  dialogFormVisible.value = false;
  activeTab.value = props.activeTabValue;
  done();
};

const rules = ref<FormRules>({
  phoneNumber: [
    { required: true, message: 'Please enter your mobile number', trigger: 'blur' },
    { min: 11, max: 11, message: 'Phone Number must be 11 digits', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!/^\d+$/.test(value)) {
          callback(new Error('Phone Number must contain only digits'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
  confirmpassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== signupForm.value.password) {
          callback(new Error('Passwords do not match'));
        } else {
          callback();
        }
      },
      message: 'Passwords do not match',
      trigger: 'blur',
    },
  ],
});

// handle Changing tabs
const handleChangeTab = (tab: string) => {
  activeTab.value = tab;
};

const isAgreeToTerms = ref(false);

// Signup Form state
const signupFormRef = ref<FormInstance>();

const signupForm = ref<TSignup>({
  phoneNumber: '',
  password: '',
  confirmpassword: '',
});

const isSignupFormValid = computed(() => {
  return signupForm.value.phoneNumber.trim() !== '' && signupForm.value.password.trim() !== '';
});

const signup = () => {
  if (!isAgreeToTerms.value) {
    showNotify({
      title: 'Error!',
      message: 'Please agree to our Terms of Service.',
      type: 'error',
    });
    return;
  }
  signupFormRef.value?.validate((valid) => {
    if (valid) {
      store.handleSignup({
        formE1: signupFormRef.value,
        handleChangeTab,
      });
    }
  });
};

// Login Form state
const loginFormRef = ref<FormInstance>();

const loginForm = ref<TLogin>({
  phoneNumber: '',
  password: '',
});

const isLoginFormValid = computed(() => {
  return loginForm.value.phoneNumber.trim() !== '' && loginForm.value.password.trim() !== '';
});

const login = () => {
  store.handleLogin({
    formE1: loginFormRef.value,
    handleCloseModal: () => {
      dialogFormVisible.value = false;
    },
  });
};
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

.dialog-footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-button):hover {
  scale: none !important;
  background-color: rgb(223, 159, 22);
  color: var(--primary-black);
}

.terms-of-service-container {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 5px;
}

.terms-of-service-container a {
  text-decoration: underline;
}
</style>
