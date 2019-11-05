<template>
  <div class="table">
    <game-card :card="card"
               :key="card.id"
               :style="getCardStyle(card)"
               v-for="card in cards"></game-card>
    <game-blackjack :blackjack="blackjack"
                    :deck-rows="deckRows"
                    :style="getBlackjackStyle(blackjack)"
                    v-if="blackjack"></game-blackjack>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(4, 1fr);
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
