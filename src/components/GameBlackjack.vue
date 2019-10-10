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

<style scoped>
.card {
  position: absolute;
  width: 96px;
  height: 144px;
  line-height: 144px;
  text-align: center;
  transition-property: top;
  transition-duration: 0.2s;
}

.card-inner {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: solid 1px #f3f3f3;
  border-radius: 6px;
  background: url('../assets/logo_b.png') center no-repeat #ffffff;
  background-size: auto 36px;
}

.card.blackjack .card-inner {
  background: url('../assets/logo_a.png') center no-repeat #ffffff;
  background-size: auto 66px;
}

.card.blackjack .card-top, .card.blackjack .card-bottom {
  display: none;
}
</style>
