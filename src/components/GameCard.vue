<template>
  <div class="card" :class="card.suit">{{ card.rank }}</div>
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

.card.diamonds,
.card.hearts {
  color: #ff0000;
}

.card.spades:after {
  content: '\2660';
}

.card.clubs:after {
  content: '\2663';
}

.card.diamonds:after {
  content: '\2666';
}

.card.hearts:after {
  content: '\2665';
}
</style>
