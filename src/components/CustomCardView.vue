<template>
  <div
    @click="emit('handleSelectCard', { index })"
    class="flip-card"
    :class="reveal && 'flipped'"
    v-motion
    ref="target"
    style="z-index: 1000"
  >
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <img class="card-image" src="/game/card_back_bg.png" alt="black" />
      </div>
      <div class="flip-card-back">
        <img class="card-image" :src="cards[Math.floor(Math.random() * 3)]" alt="ace" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { ref, watch } from 'vue'

type Props = {
  start: 'Start' | 'Pending' | 'Done'
  delay: number
  index: number
  length: number
  reveal: boolean
  selectedCard: number | null
}

const props = defineProps<Props>()
const target = ref<HTMLElement>()
const emit = defineEmits(['handleSelectCard'])
const cards = ref([
  '/game/cards-front/ace-red-heart.png',
  '/game/cards-front/2-red-heart.png',
  '/game/cards-front/3-red-heart.png',
])

const { apply } = useMotion(target, {
  initial: {
    x: 0,
    translateX: 0,
    translateY: 0,
    rotate: 0,
  },
  enter: {
    x: 0,
    rotate: 0,
  },
})

const GiveCards = async () => {
  await apply({
    x: 130,
    rotate: [0, 100, 170, 180],
    translateX: props.index * 200,
    translateY: 270,
    transition: {
      duration: 400,
      delay: props.delay,
    },
  })
}

const BringBackCards = async () => {
  await apply({
    x: 0,
    rotate: -180,
    translateX: 0,
    translateY: 0,
    transition: {
      duration: 400,
      delay: props.delay,
    },
  })
}

watch(
  () => props.start,
  () => {
    if (props.start === 'Start') {
      GiveCards()
    } else {
      BringBackCards()
    }
  },
)
</script>

<style scoped>
.card-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.flip-card {
  top: 0;
  position: absolute;
  background-color: transparent;
  width: 120px;
  height: 150px;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.3s;
  transform-style: preserve-3d;
}

/* .flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
} */

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

.flip-card-front {
  border-radius: 1em;
}

.flip-card-back {
  border-radius: 1em;
  transform: rotateY(180deg);
}
</style>
