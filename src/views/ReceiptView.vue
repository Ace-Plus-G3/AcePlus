<template>
  <div>
    <h1>{{ transaction?.transaction_id }}</h1>
    <h2>{{ transaction?.amount }}</h2>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCreditStore } from '@/stores'
import type { Transaction } from '@/types/user'

const route = useRoute()
const transactionId = computed(() => String(route.params.id))
const transaction = ref<Transaction | undefined>(undefined)

watch(
  transactionId,
  (newId) => {
    if (newId) {
      const fetchTransaction = useCreditStore().getCashinTransacById(newId)
      transaction.value = fetchTransaction
      console.log(fetchTransaction)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
* {
  color: white;
}
</style>
