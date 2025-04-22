<template>
  <el-dialog
    v-model="internalVisible"
    :title="dialogTitle"
    width="400px"
    align-center
    @close="closeDialog"
    class="custom-dialog"
  >
    <div class="transaction-status-dialog">
      <div class="status-icon">
        <svg
          v-if="status === 'success'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-check-circle success-animation"
        >
          <circle cx="12" cy="12" r="10" class="circle"></circle>
          <path d="M9 12l2 2 4-4" class="checkmark"></path>
        </svg>
        <svg
          v-if="status === 'error'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-x-circle error-animation"
        >
          <circle cx="12" cy="12" r="10" class="circle"></circle>
          <path d="M15 9l-6 6M9 9l6 6" class="xmark"></path>
        </svg>
      </div>
      <p class="message">{{ message }}</p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">OK</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:visible'])

const internalVisible = ref(props.visible)

const closeDialog = () => {
  internalVisible.value = false
  emit('update:visible', false)
}

const dialogTitle = computed(() => (props.status === 'success' ? 'Success' : 'Error'))
</script>

<style scoped>
.custom-dialog .el-dialog {
  border-radius: 8px;
  padding: 15px;
  width: 320px;
  max-width: 500px;
  text-align: center;
  margin: 0 auto;
}

.status-icon {
  display: flex;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
  opacity: 0;
  animation:
    fadeIn 0.8s ease-out forwards,
    scaleIn 0.6s ease-out forwards;
}

.status-icon svg {
  width: 50px;
  height: 50px;
}

.message {
  text-align: center;
}

.success-animation .circle,
.error-animation .circle {
  stroke: #4caf50;
  stroke-dasharray: 62.8;
  stroke-dashoffset: 62.8;
  animation: drawCircle 1s ease forwards;
}

.success-animation .checkmark,
.error-animation .xmark {
  stroke: #4caf50;
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: drawCheckmark 0.6s 1s forwards;
}

.error-animation .circle {
  stroke: #f44336;
}

.error-animation .xmark {
  stroke: #f44336;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes drawCircle {
  0% {
    stroke-dashoffset: 62.8;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes drawCheckmark {
  0% {
    stroke-dashoffset: 40;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes drawXmark {
  0% {
    stroke-dashoffset: 40;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@media (min-width: 576px) {
  .custom-dialog .el-dialog {
    width: 400px;
  }
}

@media (min-width: 768px) {
  .custom-dialog .el-dialog {
    width: 450px;
  }
}

@media (min-width: 1024px) {
  .custom-dialog .el-dialog {
    width: 500px;
  }
}
</style>
