Vue.component('game-app', {
    data: function () {
        return {
            ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
            suits: ['spades', 'clubs', 'diamonds', 'hearts'],
            cols: 10,
            rows: 4,
            levelBlackjacksIncrement: 6,
            levelBlackjacks: 0,
            blackjacks: 0,
            deckCount: 0,
            score: 0,
            speed: 1000,
            deck: [],
            cards: [],
            currentCard: null,
            mainLoop: null,
            blackjack: null,
            screenCards: {},
            state: 'initial',
            deckRowsStep: 2
        };
    },
    computed: {
        table: function () {
            return this.suits[(this.deckCount + 3) % this.suits.length];
        },
        deckRows: function () {
            return Math.ceil(this.ranks.length * this.suits.length / this.cols);
        }
    },
    methods: {
        draw: function () {
            for (i = 0; i < this.rows; i++) {
                for (j = 0; j < this.cols; j++) {
                    var card = this.cards[i][j];
                    Vue.set(this.screenCards, i + '-' + j, card);
                }
            }
        },
        dispatchControls: function (event) {
            var preventDefault = true;
            switch (event.keyCode) {
                case 37:
                case 65:
                    this.left();
                    break;
                case 39:
                case 68:
                    this.right();
                    break;
                case 40:
                case 83:
                case 32:
                    this.down();
                    break;
                case 80:
                case 145:
                    this.throttle(this.pause, 1000);
                    break;
                case 13:
                    this.start();
                    break;
                default:
                    preventDefault = false;
            }
            if (preventDefault) {
                event.preventDefault();
            }
        },
        start: function () {
            if (this.state == 'started') {
                return;
            }

            this.levelBlackjacks = this.levelBlackjacksIncrement;
            this.blackjacks = 0;
            this.score = 0;
            this.deckCount = 0;

            this.generateDeck();
            for (i = 0; i < this.rows; i++) {
                this.cards[i] = {};
                for (j = 0; j < this.cols; j++) {
                    this.cards[i][j] = null;
                }
            }
            this.currentCard = null;

            this.state = 'started';
            this.main();
            this.startLoop();
        },
        stop: function () {
            this.stopLoop();
            this.state = 'stopped';
        },
        pause: function () {
            switch (this.state) {
                case 'started':
                    this.stopLoop();
                    this.state = 'paused';
                    break;
                case 'paused':
                    this.startLoop();
                    this.state = 'started';
                    break;
            }
        },
        left: function () {
            if (this.state == 'started' && this.currentCard) {
                var card = this.currentCard;
                if (card.x > 0 && this.cards[card.y][card.x - 1] == null) {
                    this.cards[card.y][card.x - 1] = card;
                    this.cards[card.y][card.x] = null;
                    card.x -= 1;
                }
                this.draw();
            }
        },
        right: function () {
            if (this.state == 'started' && this.currentCard) {
                var card = this.currentCard;
                if (card.x < (this.cols - 1) && this.cards[card.y][card.x + 1] == null) {
                    this.cards[card.y][card.x + 1] = card;
                    this.cards[card.y][card.x] = null;
                    card.x += 1;
                }
                this.draw();
            }
        },
        down: function () {
            if (this.state == 'started') {
                this.stopLoop();
                if (this.currentCard) {
                    while (true) {
                        if (!this.lowerCard(this.currentCard)) {
                            break;
                        }
                    }
                }
                this.main();
                if (this.state == 'started') {
                    this.startLoop();
                }
            }
        },
        throttle: function (callable, time) {
            var self = this;
            if (typeof(callable.throttle) == 'undefined') {
                callable.call(self);
                callable.throttle = setTimeout(function () {
                    delete(callable.throttle);
                }, time);
            }
        },
        startLoop: function (speed) {
            this.stopLoop();
            var self = this;
            this.mainLoop = setInterval(function () {
                self.main.call(self);
            }, this.speed);
        },
        stopLoop: function () {
            if (this.mainLoop) {
                clearInterval(this.mainLoop);
            }
        },
        lowerCard: function (card) {
            if (card.y < (this.rows - 1) && this.cards[card.y + 1][card.x] == null) {
                this.cards[card.y + 1][card.x] = card;
                this.cards[card.y][card.x] = null;
                card.y += 1;
                return true;
            }
            return false;
        },
        generateDeck: function () {
            var cards = [];
            for (i = 0; i < this.suits.length; i++) {
                for (j = 0; j < this.ranks.length; j++) {
                    cards.push({rank: this.ranks[j], suit: this.suits[i]});
                }
            }
            var i = 0;
            while (cards.length > 0) {
                var key = Math.floor(Math.random() * cards.length);
                var card = cards[key];
                card.value = this.cardValue(card);
                card.deckRow = parseInt(i / this.cols);
                var reverse = card.deckRow % 2;
                if (reverse) {
                    card.x = Math.abs(i % this.cols - this.cols + 1);
                } else {
                    card.x = i % this.cols;
                }
                this.deck[i] = card;
                cards.splice(key, 1);
                i++;
            }
            this.deckCount += 1;
        },
        removeCards: function (cards) {
            for (key in cards) {
                var card = cards[key];
                this.cards[card.y][card.x] = null;
                for (y = card.y - 1; y >= 0; y--) {
                    var cardAbove = this.cards[y][card.x];
                    if (cardAbove) {
                        this.lowerCard(cardAbove);
                    }
                }
            }
        },
        findBlackjack: function () {
            for (i = this.rows - 1; i >= 0; i--) {
                for (j = 0; j < this.cols; j++) {
                    var sequence = [];
                    var sequenceSum = 0;
                    for (k = j; k < this.cols; k++) {
                        var card = this.cards[i][k];
                        if (card) {
                            sequence.push(card);
                            sequenceSum += card.value;
                            if (sequenceSum == 21) {
                                return sequence;
                            }
                            if (sequenceSum < 21) {
                                continue;
                            }
                        }
                        sequence = [];
                        sequenceSum = 0;
                    }
                }
            }
        },
        cardValue: function (card) {
            if (card.rank == 'J' || card.rank == 'Q' || card.rank == 'K') {
                return 10;
            }
            if (card.rank == 'A') {
                return 1;
            }
            return parseInt(card.rank);
        },
        addCard: function (card) {
            if (this.cards[0][card.x] == null) {
                card.y = 0;
                this.cards[0][card.x] = card;
                return true;
            }
            return false;
        },
        main: function () {
            if (this.state != 'started') {
                this.state = 'started';
            }
            if (this.currentCard && this.lowerCard(this.currentCard)) {
                this.draw();
                return;
            }
            var blackjack = this.findBlackjack();
            if (blackjack) {
                this.blackjack = {
                    x: blackjack[0].x,
                    y: blackjack[0].y,
                    length: blackjack.length
                };
                this.blackjacks += 1;
                this.score += 21;
                this.removeCards(blackjack);
                this.currentCard = null;
                this.draw();
                return;
            }
            this.blackjack = null;
            this.currentCard = this.deck.pop();
            if (!this.currentCard) {
                if (this.blackjacks < this.levelBlackjacks) {
                    this.stop();
                    return;
                }
                if (this.blackjacks > 0 && this.blackjacks % this.levelBlackjacksIncrement == 0) {
                    this.levelBlackjacks += this.levelBlackjacksIncrement;
                }
                this.generateDeck();
                this.main();
                return;
            }
            if (!this.addCard(this.currentCard)) {
                this.stop();
                return;
            }
            this.draw();
        }
    },
    mounted: function () {
        window.onkeydown = this.dispatchControls;
    },
    template: '#game-app'
});

Vue.component('game-initial-screen', {
    template: '#game-initial-screen'
});

Vue.component('game-started-screen', {
    props: ['deck', 'deckRows', 'deckRowsStep', 'screenCards', 'blackjack'],
    template: '#game-started-screen'
});

Vue.component('game-paused-screen', {
    template: '#game-paused-screen'
});

Vue.component('game-stopped-screen', {
    template: '#game-stopped-screen'
});

Vue.component('game-deck-card', {
    props: ['card', 'deckRows', 'deckRowsStep'],
    template: '#game-deck-card'
});

Vue.component('game-card', {
    props: ['card'],
    template: '#game-card'
});

Vue.component('game-blackjack', {
    props: ['blackjack', 'deckRows'],
    template: '#game-blackjack'
});

Vue.filter('suffix', function (value) {
    if (value == 1) {
        var suffix = 'st';
    } else if (value == 2) {
        var suffix = 'nd';
    } else if (value == 3) {
        var suffix = 'rd';
    } else {
        var suffix = 'th';
    }
    return suffix;
});

var app = new Vue({
    el: '#app'
});
