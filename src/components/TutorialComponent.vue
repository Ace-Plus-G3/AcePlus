<template>
    <el-tour v-model="open">
        <el-tour-step target="#jackpot-container" title="Community Jackpot" description="This is the community jackpot money which is accumalated every round, every round putting here an 5 percent of the total bet of that round!"/>
    </el-tour>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: true
    }
})

const open = ref(false)

watch(
  () => props.isOpen,
  (newValue) => {
    open.value = newValue;
  },
  { immediate: true } 
);
</script>

<style scoped>

</style>