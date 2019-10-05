<template>
  <div class="card"
       :class="card.suit"
       :style="styleObject">
    <div class="card-inner">
      <div class="card-top">
        <span class="card-rank">{{ card.rank }}</span><span class="card-suit"></span>
      </div>
      <div class="card-bottom">
        <span class="card-rank">{{ card.rank }}</span><span class="card-suit"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameCard',
  props: ['card'],
  computed: {
    styleObject: function () {
      return {
        left: (96 * this.card.x) + 'px',
        top: (144 * this.card.y + 12) + 'px'
      }
    }
  }
}
</script>
