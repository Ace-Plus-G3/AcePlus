<template>
  <div
    @click="emit('handleSelectCard', index)"
    class="flip-card"
    :class="{
      flipped: reveal,
    }"
    v-motion
    ref="target"
    style="z-index: 10"
  >
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <div class="player-count">
          <el-image class="player-count-icon" src="/game/players_icon_xs.png" />
          <el-text size="small" class="player-count-text">{{ userCount }}</el-text>
        </div>
      </div>
      <div
        class="flip-card-back"
        :style="{ backgroundImage: 'url(' + fourCards[index].url + ')' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TCardType } from '@/models/type'
import { useMotion } from '@vueuse/motion'
import { nextTick, onMounted, ref, watch } from 'vue'

type Props = {
  start: 'Start' | 'Pending' | 'Done'
  delay: number
  index: number
  length: number
  reveal: boolean
  selectedCard: number | null
  fourCards: TCardType[]
}

const emit = defineEmits(['handleSelectCard'])
const props = defineProps<Props>()

const userCount = ref(0)
const parentWidth = ref<number | null>(null)
const target = ref<HTMLElement>()

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
  if (!parentWidth.value) return

  const CARD_WIDTH = 80
  const CARD_SPACING = 40

  const TOTAL_WIDTH = props.length * CARD_WIDTH + (props.length - 1) * CARD_SPACING
  const LEFT_START = (parentWidth.value - TOTAL_WIDTH) / 2

  const cardX = props.index * (CARD_WIDTH + CARD_SPACING)
  const targetX = LEFT_START + cardX

  await apply({
    rotate: [0, 90, 180, 270, 360],
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
.flip-card {
  top: 0;
  position: absolute;
  background-color: transparent;
  width: 80px;
  height: 120px;
  perspective: 1000px;
}

.flip-card-front {
  background-image: url('/game/card_back_bg.png');
  background-size: cover;
  background-position: center;
  width: 80px;
  height: 120px;

  display: flex;
  align-items: start;
  justify-content: start;
  padding: 8px;
}

.player-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  background: rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  padding: 0 0.5em;
  /* background: white; */
  /* border: 1px solid black; */
}

.player-count-text {
  margin-top: 2px;
  color: white;
}
.player-count-icon {
  width: 15px;
  height: 15px;
}

.flip-card-back {
  /* background-image: url('/game/card_back_bg.png'); */
  background-size: cover;
  background-position: center;
  width: 80px;
  height: 120px;
}

.flip-card-inner {
  position: relative;
  width: 80px;
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
  width: 80px;
  height: 120px;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}

.flip-card.selectedCard .flip-card-inner {
  transform: scale(1.3);
  transition:
    transform 0.3s ease,
    border 0.3s ease;
}
</style>
