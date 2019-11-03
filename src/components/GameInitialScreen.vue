<template>
  <div class="card spades big">
    <div class="card-inner">
      <div class="card-top">
        <span class="card-rank">J</span><span class="card-suit"></span>
      </div>
      <div class="card-bottom">
        <span class="card-rank">J</span><span class="card-suit"></span>
      </div>
    </div>
  </div>
</template>

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

.card.big {
  position: static;
  width: 384px;
  height: 576px;
  line-height: 576px;
  margin: 0 auto;
}

.card.big .card-inner {
  border-radius: 24px;
}

.card.big .card-top {
  left: 18px;
}

.card.big .card-bottom {
  right: 18px;
}

.card.big .card-rank {
  font-size: 96px;
}

.card.big .card-suit {
  font-size: 72px;
}
</style>
