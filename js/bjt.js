var BJT = (function () {
    var Card = function (rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.x = null;
        this.y = null;
        this.element = null;
        this.points = (function () {
            if (rank == 'J' || rank == 'Q' || rank == 'K') return 10;
            if (rank == 'A') return 11;
            return parseInt(rank);
        })();
    };

    var Field = function () {
        this.id = 'field';
        this.rows = 8;
        this.cols = 8;
        this.border = 1;
        this.initX = 3;
        this.initY = 0;
        this.cards = [];
        this.cardClass = 'card';
        this.element = document.getElementById(this.id);

        // Resets field and prepares it to the game.
        this.reset = function () {
            for (i = 0; i < this.rows; i++) {
                if (!(i in this.cards)) {
                    this.cards[i] = {};
                }
                for (j = 0; j < this.cols; j++) {
                    if (j in this.cards[i]) {
                        var card = this.cards[i][j];
                        if (card) {
                            this.element.removeChild(card.element);
                        }
                    }
                    this.cards[i][j] = null;
                }
            }
        };

        // Moves the card maximally down and returns a number of skipped
        // rows.
        // TODO: Add debounce.
        this.moveCardDown = function (card) {
            var rows = 0;
            while (true) {
                var lower = this.lowerCard(card);
                if (lower) {
                    rows++;
                } else {
                    break;
                }
            }
            return rows;
        }

        // Moves the card to the right and return true. Otherwise
        // returns false.
        this.moveCardRight = function (card) {
            if (card.x < (this.cols - 1) && this.cards[card.y][card.x + 1] == null) {
                this.cards[card.y][card.x + 1] = card;
                this.cards[card.y][card.x] = null;
                card.x += 1;
                return true;
            }
            return false;
        }

        // Moves the card to the left and return true. Otherwise returns
        // false.
        this.moveCardLeft = function (card) {
            if (card.x > 0 && this.cards[card.y][card.x - 1] == null) {
                this.cards[card.y][card.x - 1] = card;
                this.cards[card.y][card.x] = null;
                card.x -= 1;
                return true;
            }
            return false;
        }

        // Moves the card down by one row and returns true. If the card
        // is not moved, return false.
        this.lowerCard = function (card) {
            if (card.y < (this.rows - 1) && this.cards[card.y + 1][card.x] == null) {
                this.cards[card.y + 1][card.x] = card;
                this.cards[card.y][card.x] = null;
                card.y += 1;
                return true;
            }
            return false;
        };

        // Adds the card to the field, setups it's initial coordinates
        // and returns true. If adding is not possible, returns false.
        this.addCard = function (card) {
            if (this.cards[this.initY][this.initX] == null) {
                card.x = this.initX;
                card.y = this.initY;
                card.element = document.createElement('div');
                card.element.textContent = card.rank;
                card.element.className = this.cardClass + ' ' + card.suit;
                this.cards[this.initY][this.initX] = card;
                return true;
            }
            return false;
        };

        this.draw = function () {
            for (i = 0; i < this.rows; i++) {
                for (j = 0; j < this.cols; j++) {
                    var card = this.cards[i][j];
                    if (card) {
                        this.element.appendChild(card.element);
                        var left = card.element.offsetWidth * card.x - this.border * card.x;
                        var top = card.element.offsetHeight * card.y - this.border * card.y;
                        card.element.style.left = left + 'px';
                        card.element.style.top = top + 'px';
                    }
                }
            }
        };
    };

    var Game = function () {
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        this.cards = [];
        this.field = null;
        this.currentCard = null;
        this.speed = 500;
        this.mainLoop = null;
        this.started = false;
        this.paused = false;

        this.init = function () {
            this.field = new Field();
            var self = this;
            window.onkeydown = function (event) {
                self.dispatchControls.call(self, event);
            };
        };

        this.dispatchControls = function (event) {
            if (event.keyCode == '37') { // Left arrow
                this.left();
            } else if (event.keyCode == '39') { // Right arrow
                this.right();
            } else if (event.keyCode == '32') { // Space
                this.down();
            } else if (event.keyCode == '80') { // P
                this.pause();
            } else if (event.keyCode == '13') { // Enter
                this.start();
            }
        };

        this.start = function () {
            if (this.started) {
                return;
            }

            // TODO: reset score and other stuff from previous game.

            this.startLevel();
        };

        this.stop = function () {
            clearInterval(this.mainLoop);
            console.log('Game over!');
            this.started = false;
        };

        this.pause = function () {
            if (this.started) {
                if (this.paused) {
                    var self = this;
                    this.mainLoop = setInterval(function () {
                        self.main.call(self);
                    }, this.speed);
                    this.paused = false;
                } else {
                    clearInterval(this.mainLoop);
                    this.paused = true;
                }
            }
        };

        this.left = function () {
            if (this.started && !this.paused) {
                this.field.moveCardLeft(this.currentCard);
                this.field.draw();
            }
        };

        this.right = function () {
            if (this.started && !this.paused) {
                this.field.moveCardRight(this.currentCard);
                this.field.draw();
            }
        };

        this.down = function () {
            if (this.started && !this.paused) {
                this.field.moveCardDown(this.currentCard);

                this.main();
                // TODO: restart main loop.

                this.field.draw();
            }
        };

        this.startLevel = function () {
            if (this.mainLoop) {
                clearInterval(this.mainLoop);
            }

            // TODO: calculate new speed.

            this.cards = this.createCards();
            this.field.reset();
            this.currentCard = null;

            this.main();
            this.startLoop(this.speed);
        };

        this.startLoop = function (speed) {
            var self = this;
            this.mainLoop = setInterval(function () {
                self.main.call(self);
            }, speed);
        };

        this.nextCard = function () {
            if (this.cards.length > 0) {
                var key = Math.floor(Math.random() * this.cards.length);
                var card = this.cards[key];
                this.cards.splice(key, 1);
                return card;
            }
            return null;
        };

        this.createCards = function () {
            var cards = []
            for (i = 0; i < this.suits.length; i++) {
                for (j = 0; j < this.ranks.length; j++) {
                    cards.push(new Card(this.ranks[j], this.suits[i]));
                }
            }
            return cards;
        };

        this.main = function () {
            if (!this.started) {
                this.started = true;
            }
            // If there is current card, move it down.
            if (this.currentCard) {
                var lower = this.field.lowerCard(this.currentCard);
            }
            // If unable to move card or there is no card, get new card.
            if (!lower || !this.currentCard) {
                this.currentCard = this.nextCard();
                // If no more cards, start new level.
                if (!this.currentCard) {
                    this.startLevel();
                    return;
                }
                // If card is not added to the field, stop game.
                if (!this.field.addCard(this.currentCard)) {
                    this.stop();
                }
            }
            // Redraw field.
            this.field.draw();
        };
    };
    return {
        init: function () {
            new Game().init();
        }
    };
}());
