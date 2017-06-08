'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Enemy = function () {
    function Enemy() {
        _classCallCheck(this, Enemy);

        this.game;
        this.sprite;
        this.emitter0;
        this.goingBack;
        this.horizontal;
    }

    _createClass(Enemy, [{
        key: 'activate',
        value: function activate() {
            this.isActive = true;
            return 'Magnet activated!';
        }
    }, {
        key: 'init',
        value: function init(game) {
            var _this = this;

            this.game = game;
            this.horizontal = this.shouldIMoveHorizontal();
            var enemyPixelPosition = gridGenerator.getPositionOfElementInPixels('E');

            this.emitter0 = game.add.emitter(enemyPixelPosition.x, enemyPixelPosition.y, 100);
            this.emitter0.makeParticles('0');
            this.emitter0.setAlpha(.5, 0, 2500);
            this.emitter0.setScale(0, 0.15, 0, 0.15, 500, Phaser.Easing.Quintic.Out);
            this.emitter0.maxParticleSpeed = new Phaser.Point(50, 50);
            this.emitter0.minParticleSpeed = new Phaser.Point(-50, -50);
            game.time.events.add(1000, function () {
                _this.emitter0.start(false, 1000, 25);
            }, this);

            this.emitter1 = game.add.emitter(enemyPixelPosition.x, enemyPixelPosition.y, 100);
            this.emitter1.makeParticles('1');
            this.emitter1.setAlpha(.5, 0, 2500);
            this.emitter1.setScale(0, 0.15, 0, 0.15, 500, Phaser.Easing.Quintic.Out);
            this.emitter1.maxParticleSpeed = new Phaser.Point(50, 50);
            this.emitter1.minParticleSpeed = new Phaser.Point(-50, -50);
            game.time.events.add(1000, function () {
                _this.emitter1.start(false, 1000, 25);
            }, this);

            this.game.badrobotGroup = this.game.add.group();
            this.sprite = game.addTweenedSprite('badrobot', enemyPixelPosition.x, enemyPixelPosition.y, 1000, 0.25);
            this.sprite.anchor.setTo(0.5, 0.8);
        }
    }, {
        key: 'go',
        value: function go(x, y) {
            var enemyPosition = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y);
            var destination = gridGenerator.convertGridToPixels(enemyPosition.x + x * 2, enemyPosition.y + y * 2);

            var moveTween = this.game.add.tween(this.sprite).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true);
            this.game.add.tween(this.emitter0).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true);
            this.game.add.tween(this.emitter1).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true);
            this.game.add.tween(this.sprite.scale).to({ x: this.sprite.scale.x * 0.8, y: this.sprite.scale.y * 0.8 }, 125, Phaser.Easing.Linear.InOut, true).yoyo(true);

            moveTween.onComplete.add(enemy.getRobbyIfYouCan, this);
        }
    }, {
        key: 'canYouGoThere',
        value: function canYouGoThere(diffX, diffY) {
            var position = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y);
            return gridGenerator.levelGrid[position.x + diffX] && gridGenerator.levelGrid[position.x + diffX][position.y + diffY] && ['-', '|'].indexOf(gridGenerator.levelGrid[position.x + diffX][position.y + diffY]) !== -1;
        }
    }, {
        key: 'notify',
        value: function notify() {
            if (this.horizontal) {
                this.goHorizontal();
            } else {
                this.goVertical();
            }
        }
    }, {
        key: 'goHorizontal',
        value: function goHorizontal() {
            if (this.goingBack) {
                if (this.canYouGoThere(-1, 0)) {
                    this.go(-1, 0);
                } else {
                    this.goingBack = false;
                    this.go(1, 0);
                }
            } else {
                if (this.canYouGoThere(1, 0)) {
                    this.go(1, 0);
                } else {
                    this.goingBack = true;
                    this.go(-1, 0);
                }
            }
        }
    }, {
        key: 'goVertical',
        value: function goVertical() {
            if (this.goingBack) {
                if (this.canYouGoThere(0, -1)) {
                    this.go(0, -1);
                } else {
                    this.goingBack = false;
                    this.go(0, 1);
                }
            } else {
                if (this.canYouGoThere(0, 1)) {
                    this.go(0, 1);
                } else {
                    this.goingBack = true;
                    this.go(0, -1);
                }
            }
        }
    }, {
        key: 'getRobbyIfYouCan',
        value: function getRobbyIfYouCan() {
            var robbyPosition = gridGenerator.convertPixelsToGrid(robby.sprite.x, robby.sprite.y);
            var enemyPosition = gridGenerator.convertPixelsToGrid(enemy.sprite.x, enemy.sprite.y);

            if (robbyPosition.x === enemyPosition.x && robbyPosition.y === enemyPosition.y) {
                var spawnPosition = gridGenerator.convertGridToPixels(0, 0);
                robby.sprite.x = spawnPosition.x;
                robby.sprite.y = spawnPosition.y;
                robby.emitter0.x = spawnPosition.x;
                robby.emitter0.y = spawnPosition.y;
                robby.emitter1.x = spawnPosition.x;
                robby.emitter1.y = spawnPosition.y;
                this.game.add.audio('explosion').play();
            }
        }
    }, {
        key: 'shouldIMoveHorizontal',
        value: function shouldIMoveHorizontal() {
            var gridPosition = gridGenerator.getPositionOfElementInGrid('E');
            var verticalNeighbours = [];
            if (gridPosition.y > 0) verticalNeighbours.push(gridGenerator.levelGrid[gridPosition.x][gridPosition.y - 1]);
            if (gridPosition.y + 1 < gridGenerator.levelGrid[0].length) verticalNeighbours.push(gridGenerator.levelGrid[gridPosition.x][gridPosition.y + 1]);

            return !(verticalNeighbours.indexOf("|") !== -1);
        }
    }]);

    return Enemy;
}();

var enemy = new Enemy();