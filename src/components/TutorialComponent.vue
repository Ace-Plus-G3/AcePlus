<template>
  <el-tour v-model="open" :show-close="false" @finish="handleFinish">
    <el-tour-step v-for="(step, index) in steps" :key="index" v-bind="step" />
     
  </el-tour>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { steps } from '@/models/constants'

const router = useRouter();

const handleFinish = () => {
  router.push({ name: 'game', query: { tutorial: 'false' } });
};

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
});

const open = ref(false);

watch(
  () => props.isOpen,
  (newValue) => {
    open.value = newValue;
  },
  { immediate: true },
);
</script>

<style scoped></style>
