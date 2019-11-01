<template>
  <div class="field">
    <div class="card big empty">
      <div class="card-inner">
        <div class="card-center">pause</div>
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

.card-center {
  display: inline-block;
  vertical-align: middle;
  padding: 6px;
  font-family: sans-serif;
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

.card.empty .card-inner {
  background: #ffff00;
  border-color: #f2f200;
}
</style>
