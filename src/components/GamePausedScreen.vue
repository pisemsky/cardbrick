<template>
  <div class="card big">
    <div class="card-inner">
      <div class="card-center">pause</div>
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
  border: solid 1px #f2f200;
  border-radius: 6px;
  background-color: #ffff00;
}

.card-center {
  display: inline-block;
  vertical-align: middle;
  padding: 6px;
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
}
</style>
