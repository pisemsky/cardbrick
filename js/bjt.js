var BJT = (function () {
    var Card = function (rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.x = null;
        this.y = null;
        this.element = null;
        this.getPoints = function () {
            if (rank == 'J' || rank == 'Q' || rank == 'K') return 10;
            if (rank == 'A') return 1;
            return parseInt(rank);
        };
    };

    var Screen = function (cols, rows, cards) {
        this.cols = cols;
        this.rows = rows;
        this.cards = cards;

        this.element = document.getElementById('screen');
        this.fieldElement = document.getElementById('field');
        this.blackjacksElement = document.getElementById('blackjacks');
        this.levelBlackjacksElement = document.getElementById('level-blackjacks');
        this.deckCountElement = document.getElementById('deck-count');
        this.deckCountSuffixElement = document.getElementById('deck-count-suffix');

        this.getFieldPaddingTop = function () {
            var style = window.getComputedStyle(this.fieldElement);
            return parseInt(style.getPropertyValue('padding-top'));
        };

        this.cardElement = function (card) {
            var container = document.createElement('div');
            container.className = 'card';
            if (card.suit == '&diams;' || card.suit == '&hearts;') {
                container.className += ' highlight';
            }
            var inner = document.createElement('div');
            inner.className = 'card-inner';
            var top = document.createElement('div');
            top.className = 'card-top';
            var bottom = document.createElement('div');
            bottom.className = 'card-bottom';
            var rank = document.createElement('span');
            rank.className = 'card-rank';
            rank.innerHTML = card.rank;
            var suit = document.createElement('span');
            suit.className = 'card-suit';
            suit.innerHTML = card.suit;
            top.appendChild(rank.cloneNode(true));
            top.appendChild(suit.cloneNode(true));
            bottom.appendChild(rank);
            bottom.appendChild(suit);
            inner.appendChild(top);
            inner.appendChild(bottom);
            container.appendChild(inner);
            return container;
        };

        this.setState = function (name) {
            this.element.className = 'screen ' + name;
        };

        this.setBlackjacks = function (value) {
            this.blackjacksElement.textContent = value;
        };

        this.setLevelBlackjacks = function (value) {
            this.levelBlackjacksElement.textContent = value;
        };

        this.setDeckCount = function (value) {
            if (value == 1) {
                var suffix = 'st';
            } else if (value == 2) {
                var suffix = 'nd';
            } else if (value == 3) {
                var suffix = 'rd';
            } else {
                var suffix = 'th';
            }
            this.deckCountSuffixElement.textContent = suffix;
            this.deckCountElement.textContent = value;
        };

        this.draw = function () {
            while (this.fieldElement.firstChild) {
                this.fieldElement.removeChild(this.fieldElement.firstChild);
            }
            for (i = 0; i < this.rows; i++) {
                for (j = 0; j < this.cols; j++) {
                    var card = this.cards[i][j];
                    if (card) {
                        if (!card.element) {
                            card.element= this.cardElement(card);
                        }
                        this.fieldElement.appendChild(card.element);
                        var left = card.element.offsetWidth * card.x;
                        var top = card.element.offsetHeight * card.y;
                        top += this.getFieldPaddingTop();
                        card.element.style.left = left + 'px';
                        card.element.style.top = top + 'px';
                    }
                }
            }
        };
    };

    var Game = function () {
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.suits = ['&clubs;', '&diams;', '&hearts;', '&spades;'];

        this.deck = [];
        this.cards = [];
        this.currentCard = null;

        this.initX = 3;
        this.initY = 0;

        this.initialLevelBlackjacks = 6;
        this.levelBlackjacks = 0;
        this.blackjacks = 0;
        this.deckCount = 0;
        this.score = 0;
        this.cols = 10;
        this.rows = 4;
        this.speed = 1000;
        this.screen = new Screen(this.cols, this.rows, this.cards);
        this.mainLoop = null;
        this.started = false;
        this.paused = false;
        this.nextBlackjack = null;

        (function () {
            var self = this;
            window.onkeydown = function (event) {
                self.dispatchControls.call(self, event);
            };
        }).call(this);

        this.dispatchControls = function (event) {
            if (event.keyCode == '37') { // Left arrow
                this.left();
            } else if (event.keyCode == '39') { // Right arrow
                this.right();
            } else if (event.keyCode == '32') { // Space
                this.down();
            } else if (event.keyCode == '80') { // P
                this.throttle(this.pause, 1000);
            } else if (event.keyCode == '13') { // Enter
                this.start();
            }
        };

        this.start = function () {
            if (this.started) {
                return;
            }

            this.levelBlackjacks = this.initialLevelBlackjacks;
            this.blackjacks = 0;
            this.score = 0;
            this.deckCount = 0;

            this.generateDeck();
            for (i = 0; i < this.rows; i++) {
                if (!(i in this.cards)) {
                    this.cards[i] = {};
                }
                for (j = 0; j < this.cols; j++) {
                    this.cards[i][j] = null;
                }
            }
            this.currentCard = null;

            this.screen.setState('started');
            this.main();
            this.startLoop();
        };

        this.stop = function () {
            this.stopLoop();
            this.started = false;
            this.screen.setState('stopped');
        };

        this.pause = function () {
            if (this.started) {
                if (this.paused) {
                    this.paused = false;
                    this.startLoop();
                    this.screen.setState('started');
                } else {
                    this.stopLoop();
                    this.paused = true;
                    this.screen.setState('paused');
                }
            }
        };

        this.left = function () {
            if (this.started && !this.paused) {
                var card = this.currentCard;
                if (card.x > 0 && this.cards[card.y][card.x - 1] == null) {
                    this.cards[card.y][card.x - 1] = card;
                    this.cards[card.y][card.x] = null;
                    card.x -= 1;
                }
                this.screen.draw();
            }
        };

        this.right = function () {
            if (this.started && !this.paused) {
                var card = this.currentCard;
                if (card.x < (this.cols - 1) && this.cards[card.y][card.x + 1] == null) {
                    this.cards[card.y][card.x + 1] = card;
                    this.cards[card.y][card.x] = null;
                    card.x += 1;
                }
                this.screen.draw();
            }
        };

        this.down = function () {
            if (this.started && !this.paused) {
                this.stopLoop();
                var bonus = 0;
                while (true) {
                    if (this.lowerCard(this.currentCard)) {
                        bonus++;
                    } else {
                        break;
                    }
                }
                this.score += bonus;
                this.main();
                if (this.started) {
                    this.startLoop();
                }
            }
        };

        this.throttle = function (callable, time) {
            var self = this;
            if (typeof(callable.throttle) == 'undefined') {
                callable.call(self);
                callable.throttle = setTimeout(function () {
                    delete(callable.throttle);
                }, time);
            }
        };

        this.startLoop = function (speed) {
            this.stopLoop();
            var self = this;
            this.mainLoop = setInterval(function () {
                self.main.call(self);
            }, this.speed);
        };

        this.stopLoop = function () {
            if (this.mainLoop) {
                clearInterval(this.mainLoop);
            }
        };

        this.lowerCard = function (card) {
            if (card.y < (this.rows - 1) && this.cards[card.y + 1][card.x] == null) {
                this.cards[card.y + 1][card.x] = card;
                this.cards[card.y][card.x] = null;
                card.y += 1;
                return true;
            }
            return false;
        };

        this.generateDeck = function () {
            var cards = [];
            for (i = 0; i < this.suits.length; i++) {
                for (j = 0; j < this.ranks.length; j++) {
                    cards.push(new Card(this.ranks[j], this.suits[i]));
                }
            }
            while (cards.length > 0) {
                var key = Math.floor(Math.random() * cards.length);
                this.deck.push(cards[key]);
                cards.splice(key, 1);
            }
            this.deckCount += 1;
        };

        this.removeCards = function (cards) {
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
        };

        this.findBlackjack = function () {
            for (i = this.rows - 1; i >= 0; i--) {
                for (j = 0; j < this.cols; j++) {
                    var sequence = [];
                    var sequenceSum = 0;
                    for (k = j; k < this.cols; k++) {
                        var card = this.cards[i][k];
                        if (card) {
                            sequence.push(card);
                            sequenceSum += card.getPoints();
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
        };

        this.addCard = function (card) {
            if (this.cards[this.initY][this.initX] == null) {
                card.x = this.initX;
                card.y = this.initY;
                this.cards[this.initY][this.initX] = card;
                return true;
            }
            return false;
        };

        this.main = function () {
            if (!this.started) {
                this.started = true;
            }
            // If there is current card, move it down.
            if (this.currentCard) {
                var lower = this.lowerCard(this.currentCard);
            }
            // If there is no card or unable to move card, calculate
            // score.
            if (!this.currentCard || !lower) {
                // Find blackjack.
                var blackjack = this.nextBlackjack || this.findBlackjack();
                if (blackjack) {
                    this.blackjacks += 1;
                    this.score += 21;
                    this.removeCards(blackjack);
                    // Increase level if necessary.
                    if (this.blackjacks == this.levelBlackjacks) {
                        this.blackjacks = 0;
                        this.levelBlackjacks += 1;
                    }
                    // Check if there is another blackjack.
                    this.nextBlackjack = this.findBlackjack();
                    if (this.nextBlackjack) {
                        return;
                    }
                }
                this.currentCard = this.deck.pop();
                // If no more cards, generate new deck;
                if (!this.currentCard) {
                    this.stopLoop();
                    this.generateDeck();
                    this.main();
                    this.startLoop();
                    return;
                }
                // If card is not added to the field, stop game.
                if (!this.addCard(this.currentCard)) {
                    this.stop();
                    return;
                }
            }
            // Update screen.
            this.screen.setBlackjacks(this.blackjacks);
            this.screen.setLevelBlackjacks(this.levelBlackjacks);
            this.screen.setDeckCount(this.deckCount);
            this.screen.draw();
        };
    };
    return {
        init: function () {
            new Game();
        }
    };
}());
