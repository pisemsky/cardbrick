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
        this.rows = 8;
        this.cols = 8;
        this.initX = 3;
        this.initY = 0;
        this.cards = [];
        this.element = document.getElementById('field');

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

        // Двигает карту вниз до конца и возвращает пропущеных строк.
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

        // Двигает карту вправо и возвращает true. Если сдвинуть карту
        // невозможно, возвращает false.
        this.moveCardRight = function (card) {
            if (card.x < (this.cols - 1) && this.cards[card.y][card.x + 1] == null) {
                this.cards[card.y][card.x + 1] = card;
                this.cards[card.y][card.x] = null;
                card.x += 1;
                return true;
            }
            return false;
        }

        // Двигает карту влево и возвращает true. Если сдвинуть карту
        // невозможно, возвращает false.
        this.moveCardLeft = function (card) {
            if (card.x > 0 && this.cards[card.y][card.x - 1] == null) {
                this.cards[card.y][card.x - 1] = card;
                this.cards[card.y][card.x] = null;
                card.x -= 1;
                return true;
            }
            return false;
        }

        // Опускает карту на одну строку и возвращает true. Если карту
        // опустить невозможно, возвращает false.
        this.lowerCard = function (card) {
            if (card.y < (this.rows - 1) && this.cards[card.y + 1][card.x] == null) {
                this.cards[card.y + 1][card.x] = card;
                this.cards[card.y][card.x] = null;
                card.y += 1;
                return true;
            }
            return false;
        };

        // Добавляет карту и задаёт ей начальные координаты. Если
        // добавление невозможно, возвращает false.
        this.addCard = function (card) {
            if (this.cards[this.initY][this.initX] == null) {
                card.x = this.initX;
                card.y = this.initY;
                card.element = document.createElement('div');
                card.element.textContent = card.rank;
                card.element.className = 'card ' + card.suit;
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
                        card.element.style.left = (card.element.offsetWidth * card.x) + 'px';
                        card.element.style.top = (card.element.offsetHeight * card.y) + 'px';
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

        // Инициализирует игровое поле, устанавливает обработчики.
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

        // Главный цикл игры
        this.main = function () {
            // Если игра уже идёт, двигаем карту вниз.
            if (this.currentCard) {
                var lower = this.field.lowerCard(this.currentCard);
            }
            // Если карта не двигается или игра только началась,
            // назначаем новую и добавляем на игровое поле.
            if (!lower || !this.currentCard) {
                this.currentCard = this.nextCard();
                if (!this.field.addCard(this.currentCard)) {
                    this.stop();
                }
            }
            this.field.draw();
        };

        // Начинает игру
        this.start = function () {
            if (this.started) {
                return;
            }
            this.cards = this.createCards();
            this.field.reset();
            this.currentCard = null;
            // TODO: разобраться со скоростью!

            this.main();

            this.started = true;
            var self = this;
            this.mainLoop = setInterval(function () {
                self.main.call(self);
            }, this.speed);
        };

        // Завершает игру (проигрыш)
        this.stop = function () {
            clearInterval(this.mainLoop);
            console.log('Game over!');
            this.started = false;
        };

        // Приостанавливает игру
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
                // TODO: следюущая итерация должна запускаться со
                // сбросом таймера.
                this.main();
                this.field.draw();
            }
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

        this.nextCard = function () {
            if (this.cards.length > 0) {
                var key = Math.floor(Math.random() * this.cards.length);
                var card = this.cards[key];
                this.cards.splice(key, 1);
                return card;
            }
        };
    };
    return {
        test: function () {
            new Game().init();
        }
    };
}());
