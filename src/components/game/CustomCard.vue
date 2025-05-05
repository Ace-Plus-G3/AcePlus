<template>
  <div class="card-container" ref="target" @click="gameLogic.handleSelectCard(index)">
    <div
      class="flip-card"
      :class="{
        flipped: gameStore.getIsRevealCards,
        selected: gameStore.selectedCards.some(
          (card) => card.value === gameStore.getFourCards[index].value,
        ),
      }"
    >
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <div class="player-count">
            <el-image class="player-count-icon" :src="playerLogo" />
            <span class="player-count-text">{{ card.playerCount }}</span>
          </div>
          <div ref="scaleRef" class="card_random_multi" v-if="card.randomMultiplier">
            {{ `${card.randomMultiplier}x` }}
          </div>
          <div class="bet-count-container">
            <div class="bet-count">
              <span class="bet-count-text">{{ convertToReadableFormat(card.totalBet) }}</span>
              <el-image class="player-count-icon" :src="GoldIcon" />
            </div>
          </div>
        </div>
        <div class="flip-card-back" :style="{ backgroundImage: 'url(' + card.url + ')' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TCardType } from '@/models/type';
import { onMounted, ref, watch, computed, nextTick } from 'vue';
import { useWindowSize } from '@vueuse/core';
import GoldIcon from '@/assets/coins/gold.png';
import playerLogo from '@/assets/icons/players_icon_xs.png';
import { convertToReadableFormat } from '@/utils/convertMoney';
import { useGameStore } from '@/stores';
import gameLogic from '@/composables/useGameLogic';
import distributeCardSound from '@/assets/audio/new-card-audio.mp3';

type Props = {
  index: number;
  card: TCardType;
  containerWidth: number;
  containerHeight: number;
};

const props = defineProps<Props>();

const target = ref<HTMLElement>();
const scaleRef = ref<HTMLElement>();
const { width } = useWindowSize();

const gameStore = useGameStore();

// Card sizing based on screen width
const CARD_WIDTH = computed(() => (width.value > 780 ? 80 : 60));
const CARD_HEIGHT = computed(() => (width.value > 780 ? 120 : 90));
const CARD_SPACING = computed(() => (width.value > 780 ? 40 : 20));

const cardDistributeSound = new Audio(distributeCardSound);

const calculateDistributionPosition = () => {
  if (props.containerWidth <= 10 || props.containerHeight <= 10) {
    console.error(`Invalid container dimensions: ${props.containerWidth}x${props.containerHeight}`);
    return { x: 10, y: -60 };
  }

  const TOTAL_WIDTH =
    gameStore.getFourCards.length * CARD_WIDTH.value +
    (gameStore.getFourCards.length - 1) * CARD_SPACING.value;
  const startX = Math.max(10, (props.containerWidth - TOTAL_WIDTH) / 2);
  const distributedX = startX + props.index * (CARD_WIDTH.value + CARD_SPACING.value);
  const centerY = Math.max(10, (props.containerHeight - CARD_HEIGHT.value) / 2);

  return { x: distributedX, y: centerY };
};

const updateCardPosition = (isDistributed: boolean) => {
  if (!target.value) return;

  const soundTimeout = setTimeout(() => {
    cardDistributeSound.volume = 0.5;
    cardDistributeSound.loop = false;
    cardDistributeSound.play();
  }, props.index * 150);
  gameLogic.addTimeout(soundTimeout);

  if (isDistributed) {
    const position = calculateDistributionPosition();
    target.value.style.transition = `transform ${200 + props.index * 200}ms ease-out`;
    target.value.style.transform = `translate(${position.x}px, ${position.y}px) rotate(360deg)`;
    target.value.style.zIndex = '10';

    const cardTimeout = setTimeout(() => {
      if (!scaleRef.value) return;
      scaleRef.value.classList.add('scaleIn');
    }, 1500);
    gameLogic.addTimeout(cardTimeout);
  } else {
    target.value.style.transition = `transform ${200 + props.index * 200}ms ease-in`;
    target.value.style.transform = `translate(10px, -60px) rotate(0deg)`;
    target.value.style.zIndex = `${10 - props.index}`;
  }
};

watch(
  () => gameStore.getIsRevealCards,
  (newValue) => {
    if (newValue) {
      cardDistributeSound.volume = 0.3;
      cardDistributeSound.loop = false;
      cardDistributeSound.play();
    }
  },
);

watch(
  () => gameStore.getStartGame,
  (newValue) => {
    if (newValue === 'START') {
      updateCardPosition(true);
    } else if (newValue === 'DONE') {
      updateCardPosition(false);
      scaleRef.value?.classList.remove('scaleIn');
    }
  },
  { immediate: true },
);

watch([() => props.containerWidth, () => props.containerHeight], ([newWidth, newHeight]) => {
  if (gameStore.getStartGame === 'START' && newWidth > 10 && newHeight > 10) {
    updateCardPosition(true);
  }
});

onMounted(async () => {
  if (target.value) {
    target.value.style.transform = 'translate(10px, -60px)';
    target.value.style.zIndex = `${10 - props.index}`;
  }

  await nextTick();

  if (
    gameStore.getStartGame === 'START' &&
    props.containerWidth > 10 &&
    props.containerHeight > 10
  ) {
    updateCardPosition(true);
  }
});
</script>

<style scoped>
.card-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  will-change: transform;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

.flip-card {
  background-color: transparent;
  width: 80px;
  height: 120px;
  perspective: 1000px;
}

.flip-card:hover {
  scale: 1.1;
  transition: all 0.3s ease-in-out;
}

.flip-card-front {
  background-image: url('@/assets/cards/back/card_back_bg.png');
  background-size: cover;
  background-position: center;
  width: 80px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  padding: 8px;
}

.bet-count-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  margin-bottom: 5px;

  .bet-count {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 2px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 30px;
    padding-left: 0.5em;
  }

  .bet-count-text {
    color: white;
    font-size: 12px;
  }
}

.player-count {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 2px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  padding-right: 1em;
  padding-left: 4px;
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

.card_random_multi {
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  scale: 0;
}

.scaleIn {
  scale: 1;
  transition:
    transform 0.5s ease,
    scale 0.5s ease;
  animation: pulse-animation 1s infinite;
}

.flip-card-back {
  background-size: cover;
  background-position: center;
  width: 80px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
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
  scale: 1.2;
  transition:
    transform 0.3s ease,
    scale 0.3s ease;
}

@keyframes pulse-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@media screen and (max-width: 780px) {
  .flip-card,
  .flip-card-inner,
  .flip-card-front,
  .flip-card-back {
    width: 60px;
    height: 90px;
  }

  .flip-card-front {
    padding: 4px !important;
  }

  .bet-count {
    padding-left: 0.2em !important;
  }
  .bet-count-text {
    font-size: 8px !important;
  }
}
</style>
