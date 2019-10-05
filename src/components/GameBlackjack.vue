<template>
  <div class="card blackjack"
       :style="styleObject">
    <div class="card-inner"></div>
  </div>
</template>

<script>
export default {
  name: 'GameBlackjack',
  props: ['blackjack', 'deckRows'],
  computed: {
    styleObject: function () {
      return {
        left: (96 * this.blackjack.x) + 'px',
        top: (144 * this.blackjack.y + 12) + 'px',
        width: (96 * this.blackjack.length) + 'px',
        zIndex: this.deckRows + 1
      }
    }
  }
}
</script>
