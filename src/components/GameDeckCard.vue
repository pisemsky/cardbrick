<template>
  <div class="card empty"
       :class="card.suit"
       :style="styleObject">
    <div class="card-inner">
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameDeckCard',
  props: ['card', 'deckRows', 'deckRowsStep'],
  computed: {
    styleObject: function () {
      return {
        left: (96 * this.card.x) + 'px',
        top: (12 - 144 - this.deckRows * this.deckRowsStep + (this.card.deckRow + 1) * this.deckRowsStep) + 'px',
        zIndex: Math.abs(this.card.deckRow - this.deckRows)
      }
    }
  }
}
</script>
