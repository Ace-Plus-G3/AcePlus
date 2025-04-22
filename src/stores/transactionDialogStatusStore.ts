import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogStore = defineStore('transactionStatusDialog', () => {
  const isVisible = ref(false)
  const status = ref<'success' | 'error'>('success')
  const message = ref('')

  // Function to show the dialog
  const showDialog = (newStatus: 'success' | 'error', newMessage: string) => {
    status.value = newStatus
    message.value = newMessage
    isVisible.value = true
  }

  // Function to close the dialog
  const closeDialog = () => {
    isVisible.value = false
  }

  return {
    isVisible,
    status,
    message,
    showDialog,
    closeDialog,
  }
})
