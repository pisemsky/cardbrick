<template>
  <div class="screen" tabindex="0" v-focus
       @keydown.pause.prevent="pause()"
       @keydown.down.prevent="down()"
       @keydown.right.prevent="right()"
       @keydown.left.prevent="left()">
    <div class="field">
      <game-table :cards="cards" :hit="hit" v-if="state == 'started'"></game-table>
      <game-message message="press P to play" v-if="state == 'initial'"></game-message>
      <game-message message="pause" v-if="state == 'paused'"></game-message>
      <game-message message="game over" v-if="state == 'stopped'"></game-message>
    </div>
    <game-status class="status-left" :mapping="{'hits': hits}"></game-status>
    <game-status class="status-right" :mapping="{'score': score}"></game-status>
    <game-button class="button-nw" caption="L" @click.prevent="left()"></game-button>
    <game-button class="button-ne" caption="R" @click.prevent="right()"></game-button>
    <game-button class="button-se" caption="D" @click.prevent="down()"></game-button>
    <game-button class="button-sw" caption="P" @click.prevent="pause()"></game-button>
  </div>
</template>

<script>
import GameTable from './GameTable.vue'
import GameMessage from './GameMessage.vue'
import GameStatus from './GameStatus.vue'
import GameButton from './GameButton.vue'

export default {
  name: 'GameScreen',
  props: [
    'state',
    'cards',
    'hit',
    'level',
    'score',
    'hits',
  ],
  components: {
    GameTable,
    GameMessage,
    GameStatus,
    GameButton
  },
  methods: {
    pause () { this.$emit('pause') },
    left () { this.$emit('left') },
    right () { this.$emit('right') },
    down () { this.$emit('down') },
  }
}
</script>

<style scoped>
.screen {
  display: grid;
  grid-template-columns: 3fr 10fr 3fr;
  grid-template-rows: 4fr 3fr 3fr;
  grid-gap: 1rem;
  box-sizing: border-box;
  height: 100vh;
  padding: 1rem;
}

.field {
  grid-column: 2;
  grid-row: 1 / 4;
  height: 100%;
}

.status-left {
  grid-column: 1;
  grid-row: 1;
  align-self: start;
}

.status-right {
  grid-column: 3;
  grid-row: 1;
  align-self: start;
}

.button-nw {
  grid-column: 1;
  grid-row: 2;
}

.button-ne {
  grid-column: 3;
  grid-row: 2;
}

.button-se {
  grid-column: 3;
  grid-row: 3;
}

.button-sw {
  grid-column: 1;
  grid-row: 3;
}
</style>
