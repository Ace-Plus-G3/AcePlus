<template>
  <div id="home-page">
    <headerComponent />
    <section>
      <ImageCarousel />
      <div class="game-component-container">
        <GameSection />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import GameSection from '@/components/GameSection.vue'
import headerComponent from '@/components/HeaderComponent.vue'
import ImageCarousel from '@/components/ImageCarousel.vue'
</script>

<style scoped>
#homePage {
  background-color: #0a0a0a;
  height: 100vh;
}

.game-component-container {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
}
</style>
