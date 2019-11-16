<template>
  <div id="app">
    <game-app></game-app>
  </div>
</template>

<script>
import GameApp from './components/GameApp.vue'

export default {
  name: 'app',
  components: {
    GameApp
  }
}
</script>

<style>
:root {
  font-family: sans-serif;
  font-size: calc(1vw + 1vh + .5vmin);
}

body {
  margin: 0;
  background: #ffffff;
  overscroll-behavior-y: contain;
}
</style>
