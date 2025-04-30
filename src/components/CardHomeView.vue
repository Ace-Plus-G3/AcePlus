<template>
  <div class="card-main-container">
    <div class="card" ref="aceRef" />
  </div>
</template>

<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { ref } from 'vue'

type Props = {
  index: number
}

const props = defineProps<Props>()

const aceRef = ref<HTMLElement>()

const { variant } = useMotion(aceRef, {
  initial: { opacity: 0, y: 200 },
  enter: {
    opacity: 1,
    y: 20,
    transition: {
      delay: 200,
      duration: 1000,
    },
  },
  leave: { opacity: 0 },
})
</script>

<style scoped>
.card-main-container {
  position: absolute;
  display: flex;
  overflow: hidden;
  bottom: 0;
}
.card {
  width: 450px;
  height: 600px;
  border-radius: 10px;
  background: red;
}
</style>
