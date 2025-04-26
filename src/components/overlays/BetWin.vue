<template>
  <el-text size="large" class="bet-win" ref="target">
    {{ bet }}
  </el-text>
</template>

<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { ref, defineProps } from 'vue'

type Props = {
  bet: string
  index: number
}

const props = defineProps<Props>()

const target = ref<HTMLElement>()

const { variant } = useMotion(target, {
  initial: { opacity: 0, y: 100 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      delay: props.index * 200,
      duration: 750,
      onComplete: () => (variant.value = 'leave'),
    },
  },
  leave: { opacity: 0 },
})
</script>

<style scoped>
.bet-win {
  position: absolute;
  color: white;
  font-size: 26px;
  top: 20%;
}

@media screen and (max-width: 1280px) {
  .bet-win {
    top: -10%;
    right: 0;
  }
}
</style>
