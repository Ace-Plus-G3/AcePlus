<template>
  <div ref="cardRef" class="card-container" :class="{ ace: isAce }">
    <el-image
      fit="cover"
      class="card"
      :src="currentCard?.url"
      :alt="currentCard?.url"
      draggable="false"
    />
  </div>
</template>

<script setup lang="ts">
import { HomeCards } from '@/models/constants';
import { computed, onMounted, ref, watch } from 'vue';
import { useWindowSize } from '@vueuse/core';
import type { THomeCards } from '@/models/type';

interface Props {
  index: number;
}

interface CardConfig {
  zIndex: number;
  xMult: number;
  yMult: number;
  rotate: number;
}

const props = defineProps<Props>();
const cardRef = ref<HTMLElement | null>(null);
const { width: windowWidth } = useWindowSize();
const isMobile = computed((): boolean => windowWidth.value <= 768);

const currentCard = computed((): THomeCards | undefined => HomeCards[props.index - 1]);
const isAce = computed((): string | boolean => props.index === 3 && 'first');

const cardConfig = computed((): CardConfig => {
  console.log(isMobile.value);
  // Mobile configuration - all cards on the right side with different offsets
  if (isMobile.value) {
    const mobileConfigs: Record<number, CardConfig> = {
      0: { zIndex: 997, xMult: -0.3, yMult: 0.3, rotate: -30 }, // 4
      1: { zIndex: 996, xMult: -0.4, yMult: 0.4, rotate: -40 }, // 5
      2: { zIndex: 1000, xMult: 0, yMult: 0, rotate: 0 }, // Center card
      3: { zIndex: 999, xMult: -0.1, yMult: 0.1, rotate: -10 }, // 2
      4: { zIndex: 998, xMult: -0.2, yMult: 0.2, rotate: -20 }, // 3
    };
    return mobileConfigs[props.index - 1] || { zIndex: 997, xMult: 0, yMult: 0, rotate: 0 };
  }

  // Desktop configuration - cards on both sides
  const desktopConfigs: Record<number, CardConfig> = {
    0: { zIndex: 999, xMult: 0.12, yMult: 0.04, rotate: 16 }, // Rightmost card
    1: { zIndex: 998, xMult: 0.24, yMult: 0.12, rotate: 32 }, // Far right card
    2: { zIndex: 1000, xMult: 0, yMult: 0, rotate: 0 }, // Center card
    3: { zIndex: 999, xMult: -0.12, yMult: 0.04, rotate: -16 }, // Left card
    4: { zIndex: 998, xMult: -0.24, yMult: 0.12, rotate: -32 }, // Far left card
  };

  return desktopConfigs[props.index - 1] || { zIndex: 997, xMult: 0, yMult: 0, rotate: 0 };
});

const getTransform = (config: CardConfig): string => {
  const x = (windowWidth.value * config.xMult).toFixed(2);
  const y = (windowWidth.value * config.yMult).toFixed(2);
  return `translate(${x}px, ${y}px) rotate(${config.rotate}deg)`;
};

const applyCardPosition = (): void => {
  if (!cardRef.value) return;

  const config = cardConfig.value;
  cardRef.value.style.zIndex = config.zIndex.toString();
  cardRef.value.style.transition = 'transform 600ms ease-in-out';
  cardRef.value.style.transform = getTransform(config);
};

// Watch for window size changes to recalculate positions
watch(
  windowWidth,
  (): void => {
    if (cardRef.value) {
      applyCardPosition();
    }
  },
  { immediate: true },
);

onMounted(() => {
  setTimeout(() => {
    applyCardPosition();
  }, 500);
});
</script>

<style scoped>
.card-container {
  position: absolute;
  bottom: -15%;
  padding: 0;
  margin: 0;
  width: 350px;
  height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
}

.ace {
  z-index: 1000;
}

@media screen and (min-width: 2560px) {
  .card-container {
    width: 420px;
    height: 650px;
  }
}

@media screen and (max-width: 768px) {
  .card-container {
    width: 240px;
    height: 420px;
    bottom: -10%;
    right: -10%;
  }
}

@media screen and (max-width: 480px) {
  .card-container {
    width: 200px;
    height: 360px;
  }
}

@media screen and (max-width: 1024px) and (max-height: 600px),
  screen and (max-width: 1280px) and (max-height: 800px) {
  .card-container {
    height: 340px;
    width: 220px;
  }
}

@media screen and (height: 1368px) {
  .card-container {
    bottom: -7%;
    height: 600px;
    width: 380px;
  }
}

@media screen and (height: 800px) {
  .card-container {
    height: 490px;
  }
}
</style>
