<template>
  <div class="field">
    <div class="card big empty">
      <div class="card-inner">
        <div class="card-top">
          <a class="social fb" href="https://www.facebook.com/sharer/sharer.php?u=https://pisemsky.com/blackjacktetris" target="_blank" rel="nofollow">F</a>
        </div>
        <div class="card-center">game over</div>
        <div class="card-bottom">
          <a class="social vk" href="https://vk.com/share.php?url=https://pisemsky.com/blackjacktetris" target="_blank" rel="nofollow">V</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.field {
  position: relative;
  width: 960px;
  height: 576px;
  padding-top: 12px;
  margin: 0 auto;
}

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

.card-center {
  display: inline-block;
  vertical-align: middle;
  padding: 6px;
  font-family: 'Alegreya Sans SC', sans-serif;
  font-size: 24px;
  line-height: 1;
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
  background: url('../assets/logo_a.png') center no-repeat #ffffff;
  background-size: auto 144px;
}

.card.big .card-top {
  left: 18px;
}

.card.big .card-bottom {
  right: 18px;
}

.card.empty .card-inner {
  background: #ffff00;
  border-color: #f2f200;
}

.social {
  display: inline-block;
  width: 64px;
  margin: 18px 0;
  border-radius: 12px;
  line-height: 64px;
  font-family: 'Alegreya Sans SC', sans-serif;
  font-size: 48px;
  text-decoration: none;
  text-align: center;
  color: #ffffff;
}

.social.fb {
  background-color: #3a5795;
}

.social.vk {
  background-color: #6281a3;
}
</style>
