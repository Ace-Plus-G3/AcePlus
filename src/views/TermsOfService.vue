<template>
  <div class="main-container">
    <el-card style="width: 700px">
      <template #header>
        <div class="card-header">
          <span><router-link to="/">Back</router-link></span>
        </div>
      </template>
      <h4>Ace+ - Terms of Service</h4>
      <p>By playing Ace+, you agree to the following:</p>
      <ol class="terms-list">
        <li>How the Game Works:</li>
        <ul>
          <li>You’ll bet on the highest-value card from four random cards.</li>
          <li>If your chosen card is the highest, you win. If not, the banker wins.</li>
        </ul>
        <li>Eligibility:</li>
        <ul>
          <li>You must be at least 18 years old to play.</li>
        </ul>
        <li>Fair Play:</li>
        <ul>
          <li>We use a random system to shuffle the cards, so everything is fair.</li>
          <li>Any cheating or misuse of the game will result in being banned.</li>
        </ul>
        <li>Account Info:</li>
        <ul>
          <li>Keep your account info secure.</li>
          <li>We’re not responsible for any issues if your account gets hacked.</li>
        </ul>
        <li>Changes:</li>
        <ul>
          <li>
            We may update the game rules or these terms from time to time. Keep an eye out for any
            changes.
          </li>
        </ul>
        <li>Limitation:</li>
        <ul>
          <li>
            Ace+ is just for fun! We’re not responsible for any losses or issues during gameplay.
          </li>
        </ul>
      </ol>
      <template #footer>By playing, you accept these simple rules. Have fun!</template>
    </el-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.main-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.terms-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

ol > li,
h4,
p,
:deep(.el-card__footer),
a {
  color: var(--primary-white);
}

ul > li {
  color: rgb(175, 175, 175);
}

ul li::marker {
  color: var(--primary-yellow);
}

:deep(.el-card) {
  font-size: 12px;
  background-color: var(--primary-black);
}

:deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
