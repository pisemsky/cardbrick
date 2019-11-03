<template>
  <div class="card"
       :class="card.suit">
    <div class="card-top">
      <span class="card-rank">{{ card.rank }}</span><span class="card-suit"></span>
    </div>
    <div class="card-bottom">
      <span class="card-rank">{{ card.rank }}</span><span class="card-suit"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameCard',
  props: ['card']
}
</script>

<style scoped>
.card {
  position: relative;
  width: 100%;
  height: 100%;
  line-height: 100%;
  text-align: center;
  box-sizing: border-box;
  border: solid 1px #f3f3f3;
  border-radius: 6px;
  background-color: #ffffff;
}

.card-top, .card-bottom {
  position: absolute;
  line-height: 1;
}

.card-top {
  top: 0;
  left: 9px;
  text-align: left;
}

.card-bottom {
  bottom: 0;
  right: 9px;
  text-align: right;
}

.card-rank {
  vertical-align: middle;
  font-size: 24px;
}

.card-suit {
  vertical-align: middle;
  font-size: 18px;
}

.card.diamonds .card-rank,
.card.hearts .card-rank,
.card.diamonds .card-suit,
.card.hearts .card-suit {
  color: #ff0000;
}

.card.spades .card-suit:before {
  content: '\2660';
}

.card.clubs .card-suit:before {
  content: '\2663';
}

.card.diamonds .card-suit:before {
  content: '\2666';
}

.card.hearts .card-suit:before {
  content: '\2665';
}
</style>
