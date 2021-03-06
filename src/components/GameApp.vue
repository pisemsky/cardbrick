<template>
  <game-screen v-bind="{state, cards, hit, level, score, hits}"
               @pause="pause()"
               @down="down()"
               @right="right()"
               @left="left()"></game-screen>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import GameScreen from './GameScreen.vue'

const initialInterval = 1000;

export default {
  name: 'GameApp',
  components: {
    GameScreen
  },
  data () {
    return {
      cols: 10,
      rows: 6,
      hits: 0,
      level: 0,
      score: 0,
      deck: [],
      cards: [],
      currentCard: null,
      mainLoop: null,
      hit: null,
      state: 'initial'
    }
  },
  methods: {
    stop () {
      this.stopLoop()
      this.state = 'stopped'
    },
    pause: _.throttle(function () {
      switch (this.state) {
        case 'initial':
        case 'stopped':
          this.hits = 0
          this.score = 0
          this.level = 0
          this.cards.splice(0, this.cards.length)
          this.generateDeck()
          this.currentCard = null
          this.state = 'started'
          this.main()
          this.startLoop()
          break
        case 'started':
          this.stopLoop()
          this.state = 'paused'
          break
        case 'paused':
          this.startLoop()
          this.state = 'started'
          break
      }
    }, initialInterval, {trailing: false}),
    left () {
      if (this.state == 'started' && this.currentCard) {
        let card = this.currentCard
        if (card.x > 0 && !this.findCard(card.x - 1, card.y)) {
          card.x -= 1
        }
      }
    },
    right () {
      if (this.state == 'started' && this.currentCard) {
        let card = this.currentCard
        if (card.x < (this.cols - 1) && !this.findCard(card.x + 1, card.y)) {
          card.x += 1
        }
      }
    },
    down () {
      if (this.state == 'started') {
        this.stopLoop()
        if (this.currentCard) {
          for (;;) {
            if (!this.lowerCard(this.currentCard)) {
              break
            }
          }
        }
        this.main()
        if (this.state == 'started') {
          this.startLoop()
        }
      }
    },
    startLoop () {
      this.stopLoop()
      this.mainLoop = setInterval(() => this.main(), initialInterval)
    },
    stopLoop () {
      if (this.mainLoop) {
        clearInterval(this.mainLoop)
      }
    },
    lowerCard (card) {
      if (card.y < (this.rows - 1) && !this.findCard(card.x, card.y + 1)) {
        card.y += 1
        return true
      }
      return false
    },
    generateDeck () {
      let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
      let suits = ['spades', 'clubs', 'diamonds', 'hearts']
      let cards = []
      let level = this.level + 1
      for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < ranks.length; j++) {
          let rank = ranks[j]
          let suit = suits[i]
          cards.push({
            rank: rank,
            suit: suit,
            id: rank + '-' + suit + '-' + level
          })
        }
      }
      let i = 0
      while (cards.length > 0) {
        let key = Math.floor(Math.random() * cards.length)
        let card = cards[key]
        card.value = this.cardValue(card)
        card.deckRow = parseInt(i / this.cols, 10)
        let reverse = card.deckRow % 2
        if (reverse) {
          card.x = Math.abs(i % this.cols - this.cols + 1)
        } else {
          card.x = i % this.cols
        }
        this.deck[i] = card
        cards.splice(key, 1)
        i++
      }
      this.level = level
    },
    removeCards (cards) {
      for (let key in cards) {
        let card = cards[key]
        this.cards.splice(this.cards.indexOf(card), 1)
        for (let y = card.y - 1; y >= 0; y--) {
          let cardAbove = this.findCard(card.x, y)
          if (cardAbove) {
            this.lowerCard(cardAbove)
          }
        }
      }
    },
    findCard (x, y) {
      return this.cards.find((card) => card.x == x && card.y == y)
    },
    findHit () {
      for (let i = this.rows - 1; i >= 0; i--) {
        for (let j = 0; j < this.cols; j++) {
          let sequence = []
          let sequenceSum = 0
          for (let k = j; k < this.cols; k++) {
            let card = this.findCard(k, i)
            if (card) {
              sequence.push(card)
              sequenceSum += card.value
              if (sequenceSum == 21) {
                return sequence
              }
              if (sequenceSum < 21) {
                continue
              }
            }
            sequence = []
            sequenceSum = 0
          }
        }
      }
    },
    cardValue (card) {
      if (card.rank == 'J' || card.rank == 'Q' || card.rank == 'K') {
        return 10
      }
      if (card.rank == 'A') {
        return 1
      }
      return parseInt(card.rank, 10)
    },
    addCard (card) {
      if (this.findCard(card.x, 0)) {
        return false
      }
      Vue.set(card, 'y', 0)
      this.cards.push(card)
      return true
    },
    main () {
      if (this.state != 'started') {
        this.state = 'started'
      }
      if (this.currentCard && this.lowerCard(this.currentCard)) {
        return
      }
      let hit = this.findHit()
      if (hit) {
        this.hit = {
          x: hit[0].x,
          y: hit[0].y,
          length: hit.length
        }
        this.hits += 1
        this.score += 21
        this.removeCards(hit)
        this.currentCard = null
        return
      }
      this.hit = null
      this.currentCard = this.deck.pop()
      if (!this.currentCard) {
        this.generateDeck()
        this.main()
        return
      }
      if (!this.addCard(this.currentCard)) {
        this.stop()
        return
      }
    }
  }
}
</script>
