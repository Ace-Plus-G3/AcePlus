<template>
  <div
    @click="emit('handleSelectCard', index)"
    class="flip-card"
    :class="{
      flipped: reveal,
      selectedCard: selectedCard === index,
    }"
    v-motion
    ref="target"
    style="z-index: 10"
  >
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <el-image
          fit="cover"
          style="width: 80px; height: 120px"
          src="/game/card_back_bg.png"
          alt="black"
        />
      </div>
      <div class="flip-card-back">
        <el-image
          fit="cover"
          style="width: 80px; height: 120px"
          :src="cards[Math.floor(Math.random() * 10)]"
          alt="ace"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { nextTick, onMounted, ref, watch } from 'vue'

type Props = {
  start: 'Start' | 'Pending' | 'Done'
  delay: number
  index: number
  length: number
  reveal: boolean
  selectedCard: number | null
}

const emit = defineEmits(['handleSelectCard'])
const props = defineProps<Props>()

const parentWidth = ref<number | null>(null)
const target = ref<HTMLElement>()
const cards = ref([
  '/game/cards-front/card_a.png',
  '/game/cards-front/card_2.png',
  '/game/cards-front/card_3.png',
  '/game/cards-front/card_4.png',
  '/game/cards-front/card_5.png',
  '/game/cards-front/card_6.png',
  '/game/cards-front/card_7.png',
  '/game/cards-front/card_8.png',
  '/game/cards-front/card_9.png',
  '/game/cards-front/card_10.png',
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

const CARD_WIDTH = 80
const CARD_SPACING = 40

const GiveCards = async () => {
  if (!parentWidth.value) return

  const TOTAL_WIDTH = props.length * CARD_WIDTH + (props.length - 1) * CARD_SPACING
  const LEFT_START = (parentWidth.value - TOTAL_WIDTH) / 2

  const cardX = props.index * (CARD_WIDTH + CARD_SPACING)
  const targetX = LEFT_START + cardX

  await apply({
    rotate: [0, 100, 170, 180],
    translateX: targetX,
    translateY: 230,
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

onMounted(async () => {
  await nextTick() // ensures DOM is fully rendered

  const parent = target.value?.parentElement
  parentWidth.value = parent?.offsetWidth ?? null

  if (parentWidth.value) {
    console.log('Parent width:', parentWidth.value)
  } else {
    console.warn('Parent width not available')
  }
})

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
  width: 80px;
  height: 120px;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 120px;
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

/* .flip-card.selectedCard .flip-card-inner {
  transform: scale(1.3);
  transition:
    transform 0.3s ease,
    border 0.3s ease;
} */
</style>
