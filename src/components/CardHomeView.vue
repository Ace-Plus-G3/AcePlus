<template>
  <div
    class="card"
    :class="{
      ace: props.index === 1 ? 'first' : 'back',
    }"
    ref="aceRef"
  />
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
      onComplete: () => handleClick(),
    },
  },
})

const handleClick = () => {
  if (!aceRef.value) {
    console.log('No aceRef value!')
    return
  }

  if (props.index === 1) {
    aceRef.value.style.zIndex = '1000'
  }

  if (props.index === 2) {
    aceRef.value.style.zIndex = '999'
    aceRef.value.style.transition = `transform ${1000}ms ease-in-out`
    aceRef.value.style.transform = `translate(350px,60px) rotate(8deg)`
    aceRef.value.style.backgroundColor = 'blue'
  }
  if (props.index === 3) {
    aceRef.value.style.zIndex = '998'
    aceRef.value.style.transition = `transform ${1000}ms ease-in-out`
    aceRef.value.style.transform = `translate(650px,140px) rotate(16deg)`
  }
  if (props.index === 4) {
    aceRef.value.style.zIndex = '999'
    aceRef.value.style.transition = `transform ${1000}ms ease-in-out`
    aceRef.value.style.transform = `translate(-350px,60px) rotate(-8deg)`
    aceRef.value.style.backgroundColor = 'blue'
  }
  if (props.index === 5) {
    aceRef.value.style.zIndex = '998'
    aceRef.value.style.transition = `transform ${1000}ms ease-in-out`
    aceRef.value.style.transform = `translate(-650px,140px) rotate(-16deg)`
  }
}
</script>

<style scoped>
.card {
  position: absolute;
  width: 450px;
  height: 600px;
  border-radius: 10px;
  background: red;
  bottom: -10%;
}

.first {
  z-index: 1000;
}

.back {
  z-index: 999;
}
</style>
