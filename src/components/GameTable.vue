<template>
  <div class="table">
    <game-card :card="card"
               :key="card.id"
               :style="getCardStyle(card)"
               v-for="card in cards"></game-card>
    <game-hit :hit="hit"
                    :style="getHitStyle(hit)"
                    v-if="hit"></game-hit>
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
import GameHit from './GameHit.vue'

export default {
  name: 'GameTable',
  components: {
    GameCard,
    GameHit
  },
  props: ['cards', 'hit'],
  methods: {
    getCardStyle (card) {
      return {
        'grid-column': card.x + 1,
        'grid-row': card.y + 1
      }
    },
    getHitStyle (hit) {
      return {
        'grid-column-start': hit.x + 1,
        'grid-column-end': hit.x + 1 + hit.length,
        'grid-row': hit.y + 1
      }
    }
  }
}
</script>
