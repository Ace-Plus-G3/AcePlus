<template>
  <el-drawer
    direction="btt"
    @close="gameStore.setDrawer(false)"
    v-model="gameStore.showBetDrawer"
    :with-header="false"
  >
    <div id="drawer" class="custom-drawer">
      <div class="custom-drawer-header">
        <span class="title">Place your bets !</span>
        <button class="cancel-btn" @click="handleCancelBet">Cancel</button>
      </div>
      <div class="drawer-content">
        <div class="bet-grid">
          <div
            @click="handleSelectBet(chip.value)"
            v-for="chip in chips"
            :key="chip.value"
            class="chip"
          >
            <img :src="chip.image" :alt="String(chip.value)" />
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { chips } from '@/models/constants';
import { useCreditStore, useDialogStore, useGameStore } from '@/stores';

const gameStore = useGameStore();
const creditStore = useCreditStore();
const dialogStore = useDialogStore();

const handleSelectBet = (betValue: number) => {
  const currentCard = gameStore.getCurrentSelectedCard;
  if (!currentCard) {
    console.log('No card selected!');
    return;
  }

  const selectedIndex = gameStore.getSelectedCards.findIndex(
    (item) => item.value === currentCard.card.value,
  );

  const cards = [...gameStore.getFourCards];
  const selectedCards = [...gameStore.getSelectedCards];

  if (selectedIndex !== -1) {
    const oldBet = selectedCards[selectedIndex].betAmount;
    if (creditStore.getCurrentBalance + oldBet < betValue) {
      dialogStore.showDialog('error', 'Insufficient balance!');
      console.log('Insufficient balance!');
      gameStore.setShowSpinTheWheel(false);
      return;
    }

    selectedCards[selectedIndex].betAmount = betValue;
    cards[currentCard.index].totalBet = cards[currentCard.index].totalBet - oldBet + betValue;
    creditStore.setCurrentBalance(creditStore.getCurrentBalance - oldBet + betValue);
  } else {
    if (creditStore.getCurrentBalance < betValue) {
      dialogStore.showDialog('error', 'Insufficient balance!');
      console.log('Insufficient balance!');
      gameStore.setShowSpinTheWheel(false);
      return;
    }
    selectedCards.push({
      ...currentCard.card,
      betAmount: betValue,
    });
    cards[currentCard.index].totalBet += betValue;
    cards[currentCard.index].playerCount += 1;
    creditStore.setCurrentBalance(creditStore.getCurrentBalance - betValue);
  }

  gameStore.setSelectedCards(selectedCards);
  gameStore.setFourCards(cards);
  gameStore.setDrawer(false);
};

const handleCancelBet = () => {
  gameStore.setDrawer(false);
  gameStore.setCurrentSelectedCard(null);
};
</script>

<style scoped>
/* Drawer Styles*/
:deep(.el-overlay) {
  overflow: hidden !important;
  display: flex;
  justify-content: center;
}

:deep(.el-drawer) {
  height: 50% !important;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

:deep(.el-overlay) {
  display: flex !important;
  justify-content: center !important;
  align-items: end !important;
}

:deep(.el-drawer__body) {
  padding: 0;
  margin: 0;
  max-width: 800px;
  min-width: 375px;
  width: 100% !important;
  height: 100% !important;
}

.custom-drawer {
  max-width: 800px;
  min-width: 375px;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

:deep(.el-overlay) {
  overflow: hidden !important;
  display: flex;
  justify-content: center;
}

:deep(.el-drawer) {
  overflow: hidden;
  background: none;
  height: 50% !important;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
}

:deep(.el-drawer__body) {
  padding: 0;
  margin: 0;
  max-width: 800px;
  min-width: 375px;
  width: 100%;
  height: 100%;
}

.custom-drawer {
  max-width: 800px;
  min-width: 375px;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Custom header */
.custom-drawer-header {
  max-width: 800px;
  min-width: 375px;
  width: 90%;
  aspect-ratio: 8.88 / 1;

  background-image: url('@/assets/game/bottombar.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  z-index: 2;
}

.drawer-content {
  width: 85%;
  height: 100%;
  z-index: 1;
  background-image: url('@/assets/game/drawer_bg.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  margin: 0;
  padding: 20px;
}

.title {
  color: #ffca28;
  font-weight: bold;
  font-size: 16px;
}

.cancel-btn {
  background-color: #e8b839;
  background: linear-gradient(
    90deg,
    rgba(232, 184, 57, 1) 0%,
    rgba(232, 184, 57, 1) 35%,
    rgba(186, 129, 21, 1) 63%,
    rgba(251, 246, 127, 1) 82%,
    rgba(220, 188, 78, 1) 100%
  );
  border: none !important;
  border: none;
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: bold;
  color: #00397f;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: background 0.3s;
}

.cancel-btn:hover {
  cursor: pointer;
}

.bet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 16px;
  justify-items: center;
}

.chip img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  transition: transform 0.2s;
  cursor: pointer;
}

.chip img:hover {
  transform: scale(1.1);
}

.cancel-btn:hover {
  background: #ffd54f;
}

@media screen and (max-width: 425px) {
  .custom-drawer-header {
    padding: 0 15px !important;
  }
}

@media screen and (max-width: 800px) {
  .custom-drawer-header {
    width: 90% !important;
  }

  :deep(.el-drawer__body) {
    width: 100%;
  }

  .chip img {
    width: 60px;
    height: 60px;
  }

  .bet-grid {
    gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }
}
</style>
