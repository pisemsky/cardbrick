<template>
  <div class="card" :class="card.suit">
    <div>{{ card.rank }}</div>
    <div class="card-suit"></div>
  </div>
</template>

<script>
export default {
  name: 'GameCard',
  props: ['card']
}
</script>

<style scoped>
.card {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  font-size: 1rem;
}

@media (orientation: landscape) {
  .card {
    flex-direction: row;
  }
}

@media (orientation: portrait) {
  .card {
    flex-direction: column;
  }
}

.card.diamonds,
.card.hearts {
  color: #ff0000;
}

.card.spades .card-suit:after {
  content: '\2660';
}

.card.clubs .card-suit:after {
  content: '\2663';
}

.card.diamonds .card-suit:after {
  content: '\2666';
}

.card.hearts .card-suit:after {
  content: '\2665';
}
</style>
