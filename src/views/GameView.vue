<template>
  <el-container>
    <HeaderView />

    <!-- Start of Overlays -->
    <GameTimer />
    <StartingInView />
    <WinBanner />
    <div class="spin-overlay" v-if="gameStore.getSpinTheWheel">
      <SpinTheWheel />
    </div>
    <div class="spin-overlay" v-if="gameStore.getJackpotSpinTheWheel">
      <JackpotWheel />
    </div>
    <!-- End of Overlays -->

    <el-main>
      <div
        class="game-container"
        ref="gameContainerRef"
        :disabled="gameStore.getStartGame === StartGameStatus.start"
      >
        <el-image id="card-back" fit="cover" :src="cardBack" alt="card_back_bg" class="card" />
        <BetWin
          v-for="(item, index) in gameStore.getAllBets"
          :key="item"
          :bet="item"
          :index="index"
        />
        <CustomCard
          id="custom-card"
          v-for="(card, index) in gameStore.getFourCards"
          :key="index"
          :index="index"
          :card="card"
          :container-height="containerHeight"
          :container-width="containerWidth"
        />
      </div>
    </el-main>

    <FooterView />
    <BetDrawer />
    <HistoryDrawer />
  </el-container>
</template>

<script setup lang="ts">
import cardBack from '@/assets/cards/back/card_back_bg.png';
import BetDrawer from '@/components/game/BetDrawer.vue';
import CustomCard from '@/components/game/CustomCard.vue';
import FooterView from '@/components/game/FooterView.vue';
import HeaderView from '@/components/game/HeaderView.vue';
import HistoryDrawer from '@/components/game/HistoryDrawer.vue';
import WinBanner from '@/components/game/WinBanner.vue';
import JackpotWheel from '@/components/JackpotWheel.vue';
import SpinTheWheel from '@/components/SpinTheWheel.vue';
import gameLogic from '@/composables/useGameLogic';
import { botNames, Cards } from '@/models/constants';
import { useCreditStore, useGameStore } from '@/stores';
import { formatCurrency } from '@/utils/convertMoney';
import { getRandomCards } from '@/utils/getRandomCards';
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useElMessage } from '@/composables/useElMessage';
import { GameStatus, StartGameStatus } from '@/models/enums';

const gameStore = useGameStore();
const creditStore = useCreditStore();
const gameContainerRef = ref<HTMLElement | null>(null);
const containerWidth = ref(0);
const containerHeight = ref(0);

const initializeGame = () => {
  // gameLogic.cleanupAllIntervals();
  // gameStore.setStartingIn(5);
  // gameStore.setRevealCard(false);
  // gameStore.setStartGame(StartGameStatus.pending);
  // gameStore.setGameStatus(GameStatus.pending);
  // gameStore.setFourCards([]);
  // gameStore.setSelectedCards([]);
  // gameStore.setAllBets([]);
  // gameStore.setAllBots([]);
  // gameStore.setTotalPlayers(0);

  const cards = getRandomCards(Cards);
  cards.forEach((item) => {
    console.log(`${item.value}`);
  });
  gameStore.setFourCards(cards);
  gameStore.setStartGame(StartGameStatus.pending);

  const newIntervalId = setInterval(() => {
    if (gameStore.getStartinIn > 0) {
      gameStore.decreaseStartingIn();
    } else {
      gameLogic.setIntervalId(undefined);

      const timeoutId = setTimeout(() => {
        gameStore.setStartGame(StartGameStatus.start);
      }, 500);
      gameLogic.addTimeout(timeoutId);
    }
  }, 1000);

  gameLogic.setIntervalId(newIntervalId);
};

const resetGameState = () => {
  gameLogic.setIntervalId(undefined);
  gameLogic.setResetCountdownId(undefined);
  gameLogic.clearAllTimeouts();

  // Reset all game state
  gameStore.setStartingIn(5);
  gameStore.setTimer(10);
  gameStore.setRevealCard(false);
  gameStore.setStartGame(StartGameStatus.pending);
  gameStore.setGameStatus(GameStatus.pending);
  gameStore.setFourCards([]);
  gameStore.setSelectedCards([]);
  gameStore.setAllBets([]);
  gameStore.setAllBots([]);
  gameStore.setTotalPlayers(0);
  gameStore.setCurrentSelectedCard(null);
  gameStore.setDrawer(false);
  gameStore.setShowSpinTheWheel(false);
};

const handleGenerateBots = () => {
  gameStore.setAllBots([]);
  const availableBotNames = [...botNames];
  const botRandomAmount = Math.floor(Math.random() * 21); // 0 to 20
  const bot_bet_choices = [1, 5, 10, 50, 500, 100, 500, 1000, 5000, 10000];

  for (let i = 0; i < botRandomAmount; i++) {
    const bot_name_index = Math.floor(Math.random() * availableBotNames.length);
    const bot_name = availableBotNames[bot_name_index];
    availableBotNames.splice(bot_name_index, 1);

    const numberOfBets = Math.floor(Math.random() * 4) + 1; // bot can bet on 1 - 4  no. of cards
    const uniqueCardIndexes = new Set<number>();

    for (let i = uniqueCardIndexes.size; i < numberOfBets; i++) {
      uniqueCardIndexes.add(Math.floor(Math.random() * 4));
    }

    const bot_cards = Array.from(uniqueCardIndexes).map((card_index) => ({
      card_index,
      bot_bet_amount: bot_bet_choices[Math.floor(Math.random() * bot_bet_choices.length)],
    }));

    const updatedBots = [...gameStore.getAllBots, { bot_name, bot_cards }];
    gameStore.setAllBots(updatedBots);
  }
};

const handleDistributeBot = () => {
  const bots = gameStore.getAllBots;
  let accumulatedDelay = Math.floor(Math.random() * 1001) + 500; // 2000–4000ms initial delay

  bots.forEach((bot) => {
    const botDelay = Math.floor(Math.random() * 300) + 200;
    accumulatedDelay += botDelay;

    const addBotTimeout = setTimeout(() => {
      gameStore.setTotalPlayers((gameStore.totalPlayers += 1));
      bot.bot_cards.forEach(({ card_index, bot_bet_amount }) => {
        gameStore.getFourCards[card_index].totalBet += bot_bet_amount;
        gameStore.getFourCards[card_index].playerCount += 1;
      });
    }, accumulatedDelay);
    gameLogic.addTimeout(addBotTimeout);
  });
};

const handleCancelBet = () => {
  gameStore.setDrawer(false);
  gameStore.setCurrentSelectedCard(null);
};

const getHighestCard = () => {
  const cards = gameStore.getFourCards;
  if (cards.length === 0) return null;

  const highestCard = cards.reduce((max, curr) => (curr.value > max.value ? curr : max));

  const timeoutId = setTimeout(() => {
    const selectedCards = gameStore.getSelectedCards;
    const hasLuckyCard = selectedCards.some((card) => card.value === 1);

    if (hasLuckyCard) {
      gameStore.setGameStatus(GameStatus.win);
      return;
    }

    const hasHighestCard = selectedCards.some((card) => card.value === highestCard.value);
    gameStore.setGameStatus(hasHighestCard ? GameStatus.win : GameStatus.lose);
  }, 500);
  gameLogic.addTimeout(timeoutId);
  return highestCard;
};

const handleRevealCard = () => {
  gameStore.setRevealCard(true);

  const cards = gameStore.getFourCards;
  if (cards.length === 0) return null;

  const highestCard = cards.reduce((max, curr) => (curr.value > max.value ? curr : max));
  const selectedCards = gameStore.getSelectedCards;
  const luckyCardIndex = selectedCards.findIndex((card) => card.value === 1);

  selectedCards.forEach((item) => {
    const luckyCard = selectedCards[luckyCardIndex];

    // item is lucky ace card
    if (luckyCardIndex >= 0 && item.value === luckyCard.value) {
      const updateSpinTheWheelTimeoutId = setTimeout(() => {
        gameStore.setBetOnAce(item.betAmount);
        gameStore.setShowSpinTheWheel(true);
      }, 1000);
      gameLogic.addTimeout(updateSpinTheWheelTimeoutId);
    }

    // item is highest card (and not the lucky ace card)
    if (item.value === highestCard.value && luckyCardIndex < 0) {
      console.log('highest!');

      let win = 0;
      if (item.randomMultiplier) {
        // If there's multiplier, the return should be the bet amount multiplied by the multiplier
        win = item.betAmount + item.betAmount * item.randomMultiplier;
      } else {
        // Just multiply by 2
        win = item.betAmount * 2;
      }

      const winBannerDelay = setTimeout(() => {
        gameStore.setBetOnCard(win);
        gameStore.setWinBanner(true);
      }, 1000);
      gameLogic.addTimeout(winBannerDelay);

      const updatedBets = [...gameStore.getAllBets, `+${formatCurrency(win)}`];
      gameStore.setAllBets(updatedBets);
      creditStore.setCurrentBalance(creditStore.getCurrentBalance + win);
      gameStore.setGameHistory({
        betValue: item.betAmount,
        amount: win,
        type: 'WIN',
        date: new Date(),
      });
    }

    // player loses
    if (
      item.value !== highestCard.value &&
      (luckyCardIndex < 0 || item.value !== luckyCard?.value)
    ) {
      const updatedBets = [...gameStore.getAllBets, `-${formatCurrency(item.betAmount)}`];
      gameStore.setAllBets(updatedBets);
      // creditStore.setCurrentBalance(creditStore.getCurrentBalance - item.betAmount);
      useElMessage().error(`You lose ₱${String(formatCurrency(item.betAmount))}!`, true);
      gameStore.setGameHistory({
        betValue: item.betAmount,
        amount: item.betAmount,
        type: 'LOSE',
        date: new Date(),
      });
    }
  });

  const timeoutId = setTimeout(() => {
    handleEndOfGame();
  }, 1000);
  gameLogic.addTimeout(timeoutId);
};

const handleResetCard = () => {
  gameLogic.cleanupAllIntervals();
  gameStore.setTimer(5);
  gameStore.setRevealCard(false);
  gameStore.setStartGame(StartGameStatus.pending);
  gameStore.setGameStatus(GameStatus.pending);
  gameStore.setFourCards([]);
  gameStore.setSelectedCards([]);
  gameStore.setAllBets([]);
  gameStore.setAllBots([]);
  gameStore.setTotalPlayers(0);
  gameStore.setWinBanner(false);

  const newCards = getRandomCards(Cards);
  gameStore.setFourCards(newCards);
  newCards.forEach((item) => {
    console.log(`${item.value}`);
  });

  const countDownTimer = setTimeout(() => {
    const countdownIntervalId = setInterval(() => {
      if (gameStore.getTimer > 0) {
        gameStore.decreaseTimer();
      } else {
        gameLogic.setResetCountdownId(undefined);
      }
    }, 1000);

    gameLogic.setResetCountdownId(countdownIntervalId);
  }, 500);
  gameLogic.addTimeout(countDownTimer);

  const resetTimer = setTimeout(() => {
    gameLogic.cleanupAllIntervals();
    gameStore.setTimer(10);
    gameStore.setStartGame(StartGameStatus.start);
  }, 7000);
  gameLogic.addTimeout(resetTimer);
};

const handleEndOfGame = () => {
  const totalBet = gameStore.getFourCards.reduce((sum, card) => sum + card.totalBet, 0);
  const fivePercent = totalBet * 0.05;

  if (fivePercent > 0) {
    const jackpot = gameStore.accumulatedJackpot + fivePercent;
    gameStore.setAccumulatedJackpot(jackpot);
    localStorage.setItem('accumulatedJackpot', jackpot.toString());
  }
};

const updateContainerDimensions = async () => {
  await nextTick();
  if (gameContainerRef.value) {
    const rect = gameContainerRef.value.getBoundingClientRect();
    containerWidth.value = rect.width;
    containerHeight.value = rect.height;
  }
};

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateContainerDimensions);
  gameLogic.cleanupAll();
});

onUnmounted(() => {
  resetGameState();
});

onMounted(async () => {
  window.addEventListener('resize', updateContainerDimensions);
  await nextTick();
  await updateContainerDimensions();
  initializeGame();
});

watch(
  () => gameStore.getStartGame,
  (newValue) => {
    if (newValue === StartGameStatus.start) {
      gameLogic.cleanupAllIntervals();

      const newGameTimeoutId = setTimeout(() => {
        handleGenerateBots();

        const newIntervalId = setInterval(() => {
          if (gameStore.getTimer > 0) {
            gameStore.decreaseTimer();
          } else {
            gameLogic.setIntervalId(undefined);
          }
        }, 1000);

        gameLogic.setIntervalId(newIntervalId);
      }, 500);
      gameLogic.addTimeout(newGameTimeoutId);

      const distributeBotTimeout = setTimeout(() => {
        handleDistributeBot();
      }, 1500);
      gameLogic.addTimeout(distributeBotTimeout);

      const resetGameTImeout = setTimeout(() => {
        console.log('11.5 secs done');
        handleCancelBet();
        getHighestCard();
        handleRevealCard();
      }, 11500);
      gameLogic.addTimeout(resetGameTImeout);

      const resetCardTimeout = setTimeout(() => {
        handleResetCard();
      }, 15500);
      gameLogic.addTimeout(resetCardTimeout);
    }
  },
);
</script>

<style scoped>
.el-container {
  position: relative;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-image: url('@/assets/homepage_bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 0;
  margin: 0;
}

.el-main {
  max-width: 800px;
  min-width: 320px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;

  .game-container {
    width: 100%;
    aspect-ratio: 2 / 1;
    max-height: 400px;
    background-image: url('@/assets/game/game_table.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    margin: 0;
    padding: 0;
  }

  .card {
    width: 80px;
    height: 120px;
    z-index: 1000;
    transform: translate(10px, -60px);
  }
}

.spin-overlay {
  z-index: 2000;
  position: fixed;
  top: 0;

  width: 100%;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 780px) {
  :deep(.card) {
    width: 60px !important;
    height: 90px !important;
  }
}

/* Drawer Styles*/

:deep(.el-drawer) {
  height: 50% !important;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
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

/* Custom header */
/* Drawer Styles*/
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
</style>
