var BJT = (function () {
    var Card = function (rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.x = null;
        this.y = null;
        this.value = null;
        this.deckRow = null;
        this.element = null;
    };

    var Screen = function (game) {
        this.game = game;
        this.deckRowsStep = 2;

        this.element = document.getElementById('screen');
        this.tableElement = document.getElementById('table');
        this.fieldElement = document.getElementById('field');
        this.blackjacksElement = document.getElementById('blackjacks');
        this.levelBlackjacksElement = document.getElementById('level-blackjacks');
        this.deckCountElement = document.getElementById('deck-count');
        this.deckCountSuffixElement = document.getElementById('deck-count-suffix');

        this.getFieldPaddingTop = function () {
            var style = window.getComputedStyle(this.fieldElement);
            return parseInt(style.getPropertyValue('padding-top'));
        };

        this.createCardElement = function (card, type) {
            var node = document.createElement('div');
            node.className = 'card';
            var inner = document.createElement('div');
            inner.className = 'card-inner';
            if (card) {
                node.className += ' ' + card.suit;
                var top = document.createElement('div');
                top.className = 'card-top';
                var bottom = document.createElement('div');
                bottom.className = 'card-bottom';
                var rank = document.createElement('span');
                rank.className = 'card-rank';
                rank.innerHTML = card.rank;
                var suit = document.createElement('span');
                suit.className = 'card-suit';
                top.appendChild(rank.cloneNode(true));
                top.appendChild(suit.cloneNode(true));
                bottom.appendChild(rank);
                bottom.appendChild(suit);
                inner.appendChild(top);
                inner.appendChild(bottom);
            }
            if (type) {
                node.className += ' ' + type;
            }
            node.appendChild(inner);
            return node;
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

        this.setTableSuit = function (suit) {
            this.tableElement.className = 'table ' + suit;
        };

        this.drawBlackjack = function () {
            if (this.game.blackjack) {
                var blackjack = this.game.blackjack;
                var element = blackjack.element;
                if (!element) {
                    var element = this.createCardElement(null, 'blackjack');
                }
                this.fieldElement.appendChild(element);
                var left = element.offsetWidth * blackjack.x;
                var top = element.offsetHeight * blackjack.y;
                top += this.getFieldPaddingTop();
                element.style.left = left + 'px';
                element.style.top = top + 'px';
                element.style.width = (element.offsetWidth * blackjack.length) + 'px';
                var self = this;
                setTimeout(function () {
                    self.game.blackjack = null;
                    self.draw.call(self);
                }, Math.round(this.game.speed / 2));
            }
        };

        this.draw = function () {
            while (this.fieldElement.firstChild) {
                this.fieldElement.removeChild(this.fieldElement.firstChild);
            }
            for (i = 0; i < this.game.rows; i++) {
                for (j = 0; j < this.game.cols; j++) {
                    var card = this.game.cards[i][j];
                    if (card) {
                        if (!card.element) {
                            card.element= this.createCardElement(card);
                        }
                        card.element.className = card.element.className.replace(' empty', '');
                        this.fieldElement.appendChild(card.element);
                        var left = card.element.offsetWidth * card.x;
                        var top = card.element.offsetHeight * card.y;
                        top += this.getFieldPaddingTop();
                        card.element.style.left = left + 'px';
                        card.element.style.top = top + 'px';
                    }
                }
            }
            for (key in this.game.deck) {
                var card = this.game.deck[key];
                if (!card.element) {
                    card.element= this.createCardElement(card);
                    card.element.className += ' empty';
                }
                this.fieldElement.appendChild(card.element);

                var height = card.element.offsetHeight;
                var rows = Math.ceil(this.game.ranks.length * this.game.suits.length / this.game.cols);
                var step = this.deckRowsStep;

                var top = this.getFieldPaddingTop() - height - rows * step + (card.deckRow + 1) * step;
                var left = card.element.offsetWidth * card.x;

                card.element.style.top = top + 'px';
                card.element.style.left = left + 'px';
                card.element.style.zIndex = Math.abs(card.deckRow - rows);
            }
            this.drawBlackjack();
        };
    };

    var Game = function () {
        this.screen = new Screen(this);
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.suits = ['spades', 'clubs', 'diamonds', 'hearts'];
        this.cols = 10;
        this.rows = 4;
        this.deck = [];
        this.cards = [];
        this.currentCard = null;
        this.initialLevelBlackjacks = 6;
        this.levelBlackjacks = 0;
        this.blackjacks = 0;
        this.deckCount = 0;
        this.score = 0;
        this.speed = 1000;
        this.mainLoop = null;
        this.started = false;
        this.paused = false;
        this.blackjack = null;
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
                this.cards[i] = {};
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
        };

        this.cardValue = function (card) {
            if (card.rank == 'J' || card.rank == 'Q' || card.rank == 'K') return 10;
            if (card.rank == 'A') return 1;
            return parseInt(card.rank);
        };

        this.addCard = function (card) {
            if (this.cards[0][card.x] == null) {
                card.y = 0;
                this.cards[0][card.x] = card;
                return true;
            }
            return false;
        };

        this.updateScreen = function () {
            this.screen.setBlackjacks(this.blackjacks);
            this.screen.setLevelBlackjacks(this.levelBlackjacks);
            this.screen.setDeckCount(this.deckCount);
            this.screen.setTableSuit(this.suits[(this.deckCount + 3) % this.suits.length]);
            this.screen.draw();
            console.log(this.score);
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
                    this.blackjack = {
                        x: blackjack[0].x,
                        y: blackjack[0].y,
                        length: blackjack.length
                    };
                    this.blackjacks += 1;
                    this.score += 21;
                    this.removeCards(blackjack);
                    // Increase level blackjacks if necessary.
                    if (this.blackjacks == this.levelBlackjacks) {
                        this.blackjacks = 0;
                        this.levelBlackjacks += 1;
                    }
                    // Check if there is another blackjack.
                    this.nextBlackjack = this.findBlackjack();
                    if (this.nextBlackjack) {
                        this.updateScreen();
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
            this.updateScreen();
        };
    };
    return {
        init: function () {
            new Game();
        }
    };
}());
