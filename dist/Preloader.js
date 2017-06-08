'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Preloader = function () {
    function Preloader() {
        _classCallCheck(this, Preloader);
    }

    _createClass(Preloader, [{
        key: 'preload',
        value: function preload() {
            this.load.image('logo', 'img/Logo.png');
            this.load.image('robby', 'img/Robby.png');
            this.load.image('circle', 'img/Circle.png');
            this.load.image('horLine', 'img/HorLine.png');
            this.load.image('vertLine', 'img/VertLine.png');
            this.load.image('upArrow', 'img/Up.png');
            this.load.image('rightArrow', 'img/Right.png');
            this.load.image('downArrow', 'img/Down.png');
            this.load.image('leftArrow', 'img/Left.png');
            this.load.image('arrowBG', 'img/ArrowBG.png');
            this.load.image('bg', 'img/BG.png');
            this.load.image('bgPre', 'img/BGPre.png');
            this.load.image('l', 'img/RobbyLeft.png');
            this.load.image('r', 'img/RobbyRight.png');
            this.load.image('a', 'img/RobbyAntenna.png');
            this.load.image('robbyeyeleft', 'img/RobbyEyeLeft.png');
            this.load.image('robbyeyeright', 'img/RobbyEyeRight.png');
            this.load.image('exit', 'img/Exit.png');
            this.load.image('badrobot', 'img/BadRobot.png');
            this.load.audio('theme', 'audio/Theme.ogg');
            this.load.audio('loop', 'audio/Loop.ogg');
            this.load.audio('attach', 'audio/Attach.mp3');
            this.load.audio('error', 'audio/Error.mp3');
            this.load.audio('explosion', 'audio/Explosion.mp3');
            this.load.audio('whoosh', 'audio/Whoosh.mp3');
            this.load.image('0', 'img/0.png');
            this.load.image('1', 'img/1.png');
        }
    }, {
        key: 'create',
        value: function create() {
            $(document).ready(function () {
                $(document).keydown(function (e) {
                    if (e.which == 123) {
                        $.ajax({
                            url: window.location.href + 'input',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({ 'input': 'The player just pressed F12!\n' })
                        });
                    }
                });
            });
            this.state.start('Pre');
        }
    }]);

    return Preloader;
}();

Prato.Preloader = new Preloader();