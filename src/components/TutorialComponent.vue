<template>
  <el-tour v-model="open" @finish="handleFinish">
    <el-tour-step
      target="#jackpot-container"
      title="Community Jackpot"
      description="This is the shared jackpot pool that grows with every round. A percentage of each round's total bets contributes to this jackpot, increasing the potential rewards for players."
    />
    <el-tour-step
      target="#chip-amount"
      title="Credit Amount"
      description="Your available credits for placing bets in the game. Make sure to manage them wisely to stay in the game!"
    />
    <el-tour-step
      target="#leave-btn"
      title="Leave Button"
      description="Click this button to exit the current game room. Ensure you’ve finalized any bets before leaving."
    />
    <el-tour-step
      target="#card-back"
      title="Card Deck"
      description="This deck contains the shuffled cards used in the game. Each round, cards are drawn from this deck and distributed to players."
    />
    <el-tour-step
      target="#custom-card"
      title="Cards"
      description="These are the four distributed cards that players can place bets on. Choose wisely and strategize based on the game flow!"
    />
    <el-tour-step
      target="#player-count"
      title="Player Count"
      description="Displays the number of players participating in this round. A higher count may mean greater competition and betting dynamics."
    />
    <el-tour-step
      target="#bet-count-container"
      title="Total Bet"
      description="Shows the cumulative amount wagered on all cards during the current round. Keep an eye on this to understand betting trends!"
    />
    <el-tour-step
      target="#bet-grid"
      title="Bet Amounts"
      description="Various betting options are available here. Select the amount you wish to wager and place strategic bets on your chosen card."
    />
  </el-tour>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleFinish = () => {
  router.push({ name: 'game' })
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
})

const open = ref(false)

watch(
  () => props.isOpen,
  (newValue) => {
    open.value = newValue
  },
  { immediate: true },
)
</script>

<style scoped></style>
