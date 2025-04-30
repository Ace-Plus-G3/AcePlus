<template>
  <div
    ref="aceRef"
    class="card-container"
    :class="{
      ace: props.index === 3 && 'first',
    }"
  >
    <el-image
      fit="cover"
      class="card"
      :src="HomeCards[props.index - 1]?.url"
      :alt="HomeCards[props.index - 1]?.url"
    />
  </div>
</template>

<script setup lang="ts">
import { HomeCards } from '@/models/constants'
import { useMotion } from '@vueuse/motion'
import { ref } from 'vue'

type Props = {
  index: number
}

const props = defineProps<Props>()
const aceRef = ref<HTMLElement>()

useMotion(aceRef, {
  initial: { opacity: 0, y: 300 },
  enter: {
    opacity: 1,
    y: 20,
    transition: {
      delay: 200,
      duration: 500,
      onComplete: () => handleAnimation(),
    },
  },
})

const handleAnimation = () => {
  if (!aceRef.value) {
    console.log('No aceRef value!')
    return
  }

  if (props.index - 1 === 0) {
    aceRef.value.style.zIndex = '999'
    aceRef.value.style.transition = `transform ${300}ms ease-in-out`
    aceRef.value.style.transform = `translate(350px,90px) rotate(16deg)`
  }
  if (props.index - 1 === 1) {
    aceRef.value.style.zIndex = '998'
    aceRef.value.style.transition = `transform ${500}ms ease-in-out`
    aceRef.value.style.transform = `translate(650px,260px) rotate(32deg)`
  }
  if (props.index - 1 === 3) {
    aceRef.value.style.zIndex = '999'
    aceRef.value.style.transition = `transform ${300}ms ease-in-out`
    aceRef.value.style.transform = `translate(-350px,90px) rotate(-16deg)`
  }
  if (props.index - 1 === 4) {
    aceRef.value.style.zIndex = '998'
    aceRef.value.style.transition = `transform ${500}ms ease-in-out`
    aceRef.value.style.transform = `translate(-650px,260px) rotate(-32deg)`
  }
}
</script>

<style scoped>
.card-container {
  position: absolute;
  bottom: -10%;
  padding: 0;
  margin: 0;
  width: 480px;
  height: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0px 5px 10px 0px black;
}

.ace {
  z-index: 1000;
}
</style>
