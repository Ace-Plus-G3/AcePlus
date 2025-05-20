import { defineStore } from 'pinia';

export const useDialogStore = defineStore('transactionStatusDialog', {
  state: () => ({
    isVisible: false as boolean,
    status: 'success' as 'success' | 'error',
    message: '' as string,
    transactionType: 'cashin' as 'cashin' | 'cashout',
  }),
  getters: {
    getTransactionType: (state) => state.transactionType,
  },
  actions: {
    setTransactionType(type: 'cashin' | 'cashout') {
      this.transactionType = type;
    },
    showDialog(newStatus: 'success' | 'error', newMessage: string) {
      this.status = newStatus;
      this.message = newMessage;
      this.isVisible = true;
    },

    closeDialog() {
      this.isVisible = false;
    },
  },
});
