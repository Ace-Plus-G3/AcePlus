<template>
  <div class="card-container" ref="target" @click="handleCardClick(index)">
    <div
      class="flip-card"
      :class="{
        flipped: reveal,
        selected: selectedCard.some((card) => card.value === fourCards[index].value),
      }"
    >
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <div class="player-count">
            <img class="player-count-icon" src="/game/players_icon_xs.png" />
            <span class="player-count-text">{{ fourCards[index].playerCount }}</span>
          </div>
        </div>
        <div
          class="flip-card-back"
          :style="{ backgroundImage: 'url(' + fourCards[index].url + ')' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TCardType } from '@/models/type'
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { useWindowSize } from '@vueuse/core'

type Props = {
  start: 'Start' | 'Pending' | 'Done'
  delay: number
  index: number
  length: number
  reveal: boolean
  selectedCard: TCardType[]
  fourCards: TCardType[]
  containerWidth: number
  containerHeight: number
}

const emit = defineEmits(['handleSelectCard'])
const props = defineProps<Props>()

const target = ref<HTMLElement>()
const { width } = useWindowSize()

// Card sizing based on screen width
const CARD_WIDTH = computed(() => (width.value > 1360 ? 80 : 60))
const CARD_HEIGHT = computed(() => (width.value > 1360 ? 120 : 90))
const CARD_SPACING = computed(() => (width.value > 1360 ? 20 : 10))

// Calculate distribution positions
const calculateDistributionPosition = () => {
  if (props.containerWidth <= 10 || props.containerHeight <= 10) {
    console.error(`Invalid container dimensions: ${props.containerWidth}x${props.containerHeight}`)
    return { x: 10, y: 10 }
  }

  const TOTAL_WIDTH = props.length * CARD_WIDTH.value + (props.length - 1) * CARD_SPACING.value
  const startX = Math.max(10, (props.containerWidth - TOTAL_WIDTH) / 2)
  const distributedX = startX + props.index * (CARD_WIDTH.value + CARD_SPACING.value)
  const centerY = Math.max(10, (props.containerHeight - CARD_HEIGHT.value) / 2)

  return { x: distributedX, y: centerY }
}

const updateCardPosition = (isDistributed: boolean) => {
  if (!target.value) return

  if (isDistributed) {
    const position = calculateDistributionPosition()
    target.value.style.transition = `transform ${200 + props.delay}ms ease-out`
    target.value.style.transform = `translate(${position.x}px, ${position.y}px) rotate(360deg)`
    target.value.style.zIndex = '10'
  } else {
    target.value.style.transition = `transform ${200 + props.delay}ms ease-in`
    target.value.style.transform = `translate(10px, 10px) rotate(0deg)`
    target.value.style.zIndex = `${10 - props.index}`
  }
}

const handleCardClick = (index: number) => {
  emit('handleSelectCard', index)
}

watch(
  () => props.start,
  (newValue) => {
    if (newValue === 'Start') {
      updateCardPosition(true)
    } else if (newValue === 'Done') {
      updateCardPosition(false)
    }
  },
  { immediate: true },
)

// Watch container size changes
watch([() => props.containerWidth, () => props.containerHeight], ([newWidth, newHeight]) => {
  if (props.start === 'Start' && newWidth > 10 && newHeight > 10) {
    updateCardPosition(true)
  }
})

// Initialize position at top left corner
onMounted(async () => {
  if (target.value) {
    target.value.style.transform = 'translate(10px, 10px)'
    target.value.style.zIndex = `${10 - props.index}`
  }

  await nextTick()

  if (props.start === 'Start' && props.containerWidth > 10 && props.containerHeight > 10) {
    updateCardPosition(true)
  }
})
</script>

<style scoped>
.card-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  will-change: transform;
}

.flip-card {
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
}

.player-count-text {
  margin-top: 2px;
  color: white;
  font-size: 12px;
}

.player-count-icon {
  width: 15px;
  height: 15px;
}

.flip-card-back {
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

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 80px;
  height: 120px;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.flip-card-back {
  transform: rotateY(180deg);
}

.flip-card.selected .flip-card-inner {
  scale: 1.3;
  transition:
    transform 0.3s ease,
    scale 0.3s ease;
}

@media screen and (max-width: 1360px) {
  .flip-card,
  .flip-card-inner,
  .flip-card-front,
  .flip-card-back {
    width: 60px;
    height: 90px;
  }
}
</style>
