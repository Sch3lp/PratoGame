"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Magnet = function () {
    function Magnet() {
        _classCallCheck(this, Magnet);

        this.isActive = false;
    }

    _createClass(Magnet, [{
        key: "activate",
        value: function activate() {
            this.isActive = true;
            return 'Magnet activated!';
        }
    }]);

    return Magnet;
}();

var Attachable = function () {
    function Attachable(element, name) {
        _classCallCheck(this, Attachable);

        this.isAttachable = true;
        this.magnet = new Magnet();
        this.element = element;
        this.sprite;
        this.text;
        this.name = name;
    }

    _createClass(Attachable, [{
        key: "init",
        value: function init(game) {
            var position = gridGenerator.getPositionOfElementInPixels(this.element);
            this.sprite = game.addTweenedSprite(this.element, position.x, position.y, 1000, 0.3);

            var style = { font: "16px Arial Black", fill: "#062A5A", boundsAlignH: "center", boundsAlignV: "middle" };

            this.text = game.add.text(position.x, position.y, this.name, style);
            this.text.stroke = "#FFFFFF";
            this.text.strokeThickness = 4;
            this.text.setShadow(2, 2, "#333333", 2, true, false);
            this.text.alpha = 0;
            this.text.anchor.set(0.5);
        }
    }]);

    return Attachable;
}();

var leftArm = new Attachable('l', 'leftArm');
var rightArm = new Attachable('r', 'rightArm');
var antenna = new Attachable('a', 'antenna');