import { defineStore } from 'pinia'

export const useDialogStore = defineStore('transactionStatusDialog', {
  state: () => ({
    isVisible: false as boolean,
    status: 'success' as 'success' | 'error',
    message: '' as string,
  }),
  actions: {
    showDialog(newStatus: 'success' | 'error', newMessage: string) {
      this.status = newStatus
      this.message = newMessage
      this.isVisible = true
    },

    closeDialog() {
      this.isVisible = false
    },
  },
})
