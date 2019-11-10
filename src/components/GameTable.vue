<template>
  <div class="table">
    <game-card :card="card"
               :key="card.id"
               :style="getCardStyle(card)"
               v-for="card in cards"></game-card>
    <game-blackjack :blackjack="blackjack"
                    :style="getBlackjackStyle(blackjack)"
                    v-if="blackjack"></game-blackjack>
  </div>
</template>

<style scoped>
.table {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 1px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: #00de9a;
}
</style>

<script>
import GameCard from './GameCard.vue'
import GameBlackjack from './GameBlackjack.vue'

export default {
  name: 'GameTable',
  components: {
    GameCard,
    GameBlackjack
  },
  props: ['cards', 'blackjack'],
  methods: {
    getCardStyle(card) {
      return {
        'grid-column': card.x + 1,
        'grid-row': card.y + 1
      }
    },
    getBlackjackStyle(blackjack) {
      return {
        'grid-column-start': blackjack.x + 1,
        'grid-column-end': blackjack.x + 1 + blackjack.length,
        'grid-row': blackjack.y + 1
      }
    }
  }
}
</script>
