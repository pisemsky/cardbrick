<template>
  <div class="card"
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
  border: solid 1px #f2f200;
  border-radius: 6px;
  background-color: #ffff00;
}
</style>
