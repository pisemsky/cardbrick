<template>
  <div class="field">
    <game-deck-card :card="card"
                    :key="card.id"
                    :deck-rows="deckRows"
                    :deck-rows-step="deckRowsStep"
                    v-for="card in deck"></game-deck-card>
    <game-card :card="card"
               :key="card.id"
               v-for="card in cards"
               v-if="card"></game-card>
    <game-blackjack :blackjack="blackjack"
                    :deck-rows="deckRows"
                    v-if="blackjack"></game-blackjack>
  </div>
</template>

<script>
import GameDeckCard from './GameDeckCard.vue'
import GameCard from './GameCard.vue'
import GameBlackjack from './GameBlackjack.vue'

export default {
  name: 'GameStartedScreen',
  components: {
    GameDeckCard,
    GameCard,
    GameBlackjack
  },
  props: ['deck', 'deckRows', 'deckRowsStep', 'cards', 'blackjack']
}
</script>
