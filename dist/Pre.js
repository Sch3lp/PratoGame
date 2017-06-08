'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pre = function () {
    function Pre() {
        _classCallCheck(this, Pre);
    }

    _createClass(Pre, [{
        key: 'create',
        value: function create() {
            var _this = this;

            var music = this.add.audio('theme');
            music.play();
            music.onStop.add(this.startLoop, this);
            var callback = function callback() {
                _this.input.keyboard.onDownCallback = null;
                $("#titleImage").hide();
                _this.state.start('Game');
            };
            this.input.keyboard.onDownCallback = callback;
            $("#titleImage").click(callback);
        }
    }, {
        key: 'startLoop',
        value: function startLoop() {
            this.add.audio('loop').loopFull();
        }
    }]);

    return Pre;
}();

Prato.Pre = new Pre();