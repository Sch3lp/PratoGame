'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Robby = function () {
    function Robby() {
        _classCallCheck(this, Robby);

        this.windingKey = new WindingKey();
        this.navigation = new Navigation();
        this.lPosition = { x: 140, y: 58 };
        this.rPosition = { x: -140, y: 58 };
        this.aPosition = { x: 0, y: -195 };
        this.game;
        this.sprite;
        this.emitter0;
        this.emitter1;
        this.leftEye;
        this.rightEye;
    }

    _createClass(Robby, [{
        key: 'init',
        value: function init(game) {
            var _this = this;

            this.game = game;
            var position = gridGenerator.getPositionOfElementInPixels('R');

            this.emitter0 = game.add.emitter(position.x, position.y, 100);
            this.emitter0.makeParticles('0');
            this.emitter0.setAlpha(.5, 0, 2500);
            this.emitter0.setScale(0, 0.15, 0, 0.15, 500, Phaser.Easing.Quintic.Out);
            this.emitter0.maxParticleSpeed = new Phaser.Point(50, 50);
            this.emitter0.minParticleSpeed = new Phaser.Point(-50, -50);
            game.time.events.add(1000, function () {
                _this.emitter0.start(false, 1000, 25);
            }, this);

            this.emitter1 = game.add.emitter(position.x, position.y, 100);
            this.emitter1.makeParticles('1');
            this.emitter1.setAlpha(.5, 0, 2500);
            this.emitter1.setScale(0, 0.15, 0, 0.15, 500, Phaser.Easing.Quintic.Out);
            this.emitter1.maxParticleSpeed = new Phaser.Point(50, 50);
            this.emitter1.minParticleSpeed = new Phaser.Point(-50, -50);
            game.time.events.add(1000, function () {
                _this.emitter1.start(false, 1000, 25);
            }, this);

            this.game.robbyGroup = this.game.add.group();
            this.sprite = game.addTweenedSprite('robby', position.x, position.y, 1000, 0.3);
            this.leftEye = game.addTweenedSprite('robbyeyeleft', -57, -95, 1000, 1);
            this.rightEye = game.addTweenedSprite('robbyeyeright', 52, -95, 1000, 1);
            this.leftEye.anchor.setTo(0.1, 0.5);
            this.rightEye.anchor.setTo(0.1, 0.5);
            this.sprite.addChild(this.leftEye);
            this.sprite.addChild(this.rightEye);
        }
    }, {
        key: 'go',
        value: function go() {
            if (!this.windingKey.windCalled) return 'Robby cannot go without winding the windingKey!';
            if (!this.navigation.setNavigationCalled) return 'Robby cannot go without setting the navigation!';
            if (!this.canYouGoThere(this.navigation.x, this.navigation.y)) return 'I cannot go there!';
            this.windingKey.windCalled = false;
            this.navigation.setNavigationCalled = false;
            var robbyPosition = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y);
            var destination = gridGenerator.convertGridToPixels(robbyPosition.x + this.navigation.x * 2, robbyPosition.y + this.navigation.y * 2);

            var moveTween = this.game.add.tween(this.sprite).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true);
            this.game.add.tween(this.emitter0).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true);
            this.game.add.tween(this.emitter1).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true);
            this.game.add.tween(this.sprite.scale).to({ x: this.sprite.scale.x * 0.8, y: this.sprite.scale.y * 0.8 }, 125, Phaser.Easing.Linear.InOut, true).yoyo(true);
            enemy.notify();

            this.game.add.audio('whoosh').play();
            moveTween.onComplete.add(this.checkIfYoureThere, this);
        }
    }, {
        key: 'goRight',
        value: function goRight() {
            this.windingKey.wind();
            this.navigation.setNavigation(1, 0);
            var problem = this.go();
            if (problem) return problem;
            return 'GOING!';
        }
    }, {
        key: 'canYouGoThere',
        value: function canYouGoThere(diffX, diffY) {
            var position = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y);
            return gridGenerator.levelGrid[position.x + diffX] && gridGenerator.levelGrid[position.x + diffX][position.y + diffY] && ['-', '|'].indexOf(gridGenerator.levelGrid[position.x + diffX][position.y + diffY]) !== -1;
        }
    }, {
        key: 'doABarrelRoll',
        value: function doABarrelRoll() {
            var _this2 = this;

            var barrelRoll = this.game.add.tween(this.sprite).to({ angle: 359 }, 250, Phaser.Easing.Linear.None, true);
            barrelRoll.onComplete.add(function () {
                _this2.sprite.angle = 0;
            }, this);
        }
    }, {
        key: 'attach',
        value: function attach(part) {
            if (!part.isAttachable) return 'Can only attach Attachables';
            var myPosition = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y);
            var partPosition = gridGenerator.convertPixelsToGrid(part.sprite.x, part.sprite.y);
            var distance = Math.abs(myPosition.x - partPosition.x) + Math.abs(myPosition.y - partPosition.y);
            if (distance > 1) return 'Can only attach adjacent Attachables';
            part.sprite.scale.setTo(1, 1);
            part.sprite.x -= robby.sprite.x;
            part.sprite.y -= robby.sprite.y;
            this.sprite.addChild(part.sprite);
            this.game.add.tween(part.sprite).to({ x: this[part.element + 'Position'].x, y: this[part.element + 'Position'].y }, 250, Phaser.Easing.Linear.In, true);
            this.game.add.tween(part.sprite).to({ angle: Math.random() >= 0.5 ? 720 : -720 }, 250, Phaser.Easing.Linear.In, true);
            this.game.add.audio('attach').play();
            return 'Attachment successful';
        }
    }, {
        key: 'checkIfYoureThere',
        value: function checkIfYoureThere() {
            var exitPosition = gridGenerator.getPositionOfElementInGrid('e');
            var myPosition = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y);
            if (exitPosition.x !== myPosition.x || exitPosition.y !== myPosition.y) return;
            if (this.checkIfComplete()) {
                this.game.goToPostState();
            } else {
                this.game.add.audio('error').play();
                this.game.setHistory('ERROR! Robby cannot leave the facility without attaching all remaining parts!');
            }
        }
    }, {
        key: 'checkIfComplete',
        value: function checkIfComplete() {
            var childrenSpriteKeys = this.sprite.children.map(function (ch) {
                return ch.key;
            });
            if (!(childrenSpriteKeys.indexOf('l') !== -1)) return false;
            if (!(childrenSpriteKeys.indexOf('r') !== -1)) return false;
            if (!(childrenSpriteKeys.indexOf('a') !== -1)) return false;
            return true;
        }
    }]);

    return Robby;
}();

var WindingKey = function () {
    function WindingKey() {
        _classCallCheck(this, WindingKey);

        this.windCalled = false;
    }

    _createClass(WindingKey, [{
        key: 'wind',
        value: function wind() {
            this.windCalled = true;
        }
    }]);

    return WindingKey;
}();

var Navigation = function () {
    function Navigation() {
        _classCallCheck(this, Navigation);

        this.x = 0;
        this.y = 0;
        this.setNavigationCalled = false;
    }

    _createClass(Navigation, [{
        key: 'setNavigation',
        value: function setNavigation(x, y) {
            this.setNavigationCalled = true;
            this.x = x;
            this.y = y;
        }
    }]);

    return Navigation;
}();

var robby = new Robby();

var help = function help() {
    if (!robby.goDown) return 'Try implementing all the go functions on Robby!';
    if (!robby.checkIfComplete()) return 'Try to attach all parts to Robby!';
    return 'Try to reach the exit';
};

var hack = function hack() {
    Robby.prototype.goUp = function () {
        this.windingKey.wind();
        this.navigation.setNavigation(0, -1);
        var problem = this.go();
        if (problem) return problem;
        return 'GOING!';
    };

    Robby.prototype.goLeft = function () {
        this.windingKey.wind();
        this.navigation.setNavigation(-1, 0);
        var problem = this.go();
        if (problem) return problem;
        return 'GOING!';
    };

    Robby.prototype.goDown = function () {
        this.windingKey.wind();
        this.navigation.setNavigation(0, 1);
        var problem = this.go();
        if (problem) return problem;
        return 'GOING!';
    };
    return 'Hack successful';
};