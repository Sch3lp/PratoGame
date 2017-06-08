'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this.startText = '---------------------------------------------------\n\
PLEASE REASSEMBLE ROBBY AND LEAVE THE FACILITY\n\
INVOKE THE HELP FUNCTION IF YOU NEED A HAND\n\
---------------------------------------------------';
        this.editor;
        this.history;
        this.previousEntries = [];
        this.previousEntryIndex = -1;
        this.isNotFirstRun;
        this.gridGroup;
        this.exitGroup;
        this.robbyGroup;
        this.badrobotGroup;
    }

    _createClass(Game, [{
        key: 'init',
        value: function init(isNotFirstRun) {
            this.isNotFirstRun = isNotFirstRun;
        }
    }, {
        key: 'create',
        value: function create() {
            this.add.sprite(0, 0, 'bg');
            this.gridGroup = this.add.group();
            this.exitGroup = this.add.group();

            gridGenerator.setupGrid(this);
            this.postNewSession();
            this.setupCharacters();
            this.setupParts();
            this.setupArrows();

            document.getElementById('codeMirrorDiv').style.display = 'block';
            var inputField = document.getElementById('commandInput');
            this.editor = CodeMirror.fromTextArea(inputField, {
                mode: 'javascript',
                theme: 'night',
                scrollbarStyle: 'simple',
                extraKeys: {
                    Enter: this.enterKeyDown.bind(this),
                    Up: this.handleArrowUp.bind(this),
                    Down: this.handleArrowDown.bind(this)
                },
                styleActiveLine: true,
                matchBrackets: true
            });
            this.editor.on("change", this.checkForAttachDirective.bind(this));
            var historyField = document.getElementById('historyTextArea');
            this.history = CodeMirror.fromTextArea(historyField, {
                mode: 'javascript',
                theme: 'night',
                readOnly: true,
                scrollbarStyle: 'simple',
                lineWrapping: true
            });

            this.shiftKey = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.pressRightArrow, this);
            this.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.pressDownArrow, this);
            this.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.pressLeftArrow, this);
            this.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.pressUpArrow, this);

            this.history.setValue(this.startText);
        }
    }, {
        key: 'update',
        value: function update() {
            this.rollEyes();
        }
    }, {
        key: 'rollEyes',
        value: function rollEyes() {
            var mousePositionX = this.input.mousePointer.x;
            var mousePositionY = this.input.mousePointer.y;

            var xDiffLeft = mousePositionX - (robby.sprite.x - 15);
            var xDiffRight = mousePositionX - (robby.sprite.x + 15);
            var yDiff = mousePositionY - (robby.sprite.y - 27);

            var angleLeft = Math.atan2(yDiff, xDiffLeft);
            var angleRight = Math.atan2(yDiff, xDiffRight);
            robby.leftEye.rotation = angleLeft;
            robby.rightEye.rotation = angleRight;
        }
    }, {
        key: 'enterKeyDown',
        value: function enterKeyDown() {
            var input = this.editor.getValue();
            if (input.trim() === '') {
                this.editor.setValue('');
                return;
            }
            if (this.shiftKey.isDown) {
                this.makeNewLineAtCursorAndRememberCursorPosition(input);
                return;
            }
            this.previousEntries.push(input);
            this.previousEntryIndex = this.previousEntries.length - 1;
            if (input[input.length - 1] === '\n') input = input.slice(0, -1);

            var result = this.evaluateCall(input);

            this.setHistory(input, result);
            this.editor.setValue('');
            this.postInput(input);
        }
    }, {
        key: 'checkForAttachDirective',
        value: function checkForAttachDirective(cm, change) {
            var editorValue = this.editor.getValue();
            if (editorValue.indexOf("robby.attach") !== -1 && !(editorValue.indexOf("leftArm") !== -1) && !(editorValue.indexOf("rightArm") !== -1) && !(editorValue.indexOf("antenna") !== -1)) {

                var childMap = robby.sprite.children.map(function (ch) {
                    return ch.key;
                });

                if (!(childMap.indexOf('l') !== -1)) this.add.tween(leftArm.text).to({ alpha: 1 }, 250, Phaser.Easing.Linear.In, true);
                if (!(childMap.indexOf('r') !== -1)) this.add.tween(rightArm.text).to({ alpha: 1 }, 250, Phaser.Easing.Linear.In, true);
                if (!(childMap.indexOf('a') !== -1)) this.add.tween(antenna.text).to({ alpha: 1 }, 250, Phaser.Easing.Linear.In, true);
            } else {
                this.add.tween(leftArm.text).to({ alpha: 0 }, 250, Phaser.Easing.Linear.In, true);
                this.add.tween(rightArm.text).to({ alpha: 0 }, 250, Phaser.Easing.Linear.In, true);
                this.add.tween(antenna.text).to({ alpha: 0 }, 250, Phaser.Easing.Linear.In, true);
            }
        }
    }, {
        key: 'handleArrowUp',
        value: function handleArrowUp(instance, name, event) {
            if (this.previousEntryIndex === -1 || this.editor.getCursor().line !== 0) return CodeMirror.Pass;
            this.editor.setValue(this.previousEntries[this.previousEntryIndex]);
            this.previousEntryIndex = Math.max(0, this.previousEntryIndex - 1);
        }
    }, {
        key: 'handleArrowDown',
        value: function handleArrowDown(instance, name, event) {
            var lastLine = this.editor.getValue().split('\n').length - 1;
            if (this.previousEntryIndex === -1 || this.editor.getCursor().line !== lastLine) return CodeMirror.Pass;
            this.editor.setValue(this.previousEntries[this.previousEntryIndex]);
            this.previousEntryIndex = Math.min(this.previousEntries.length - 1, this.previousEntryIndex + 1);
        }
    }, {
        key: 'makeNewLineAtCursorAndRememberCursorPosition',
        value: function makeNewLineAtCursorAndRememberCursorPosition(input) {
            var newCursorPosition = this.editor.getCursor();
            var splittedInput = input.split('\n');
            var splittedLineWhereCursorIs = splittedInput[newCursorPosition.line];
            splittedInput[newCursorPosition.line] = [splittedLineWhereCursorIs.slice(0, newCursorPosition.ch), '\n', splittedLineWhereCursorIs.slice(newCursorPosition.ch)].join('');
            this.editor.setValue(splittedInput.join('\n'));
            newCursorPosition.line++;
            newCursorPosition.ch = 0;
            this.editor.setCursor(newCursorPosition);
        }
    }, {
        key: 'setHistory',
        value: function setHistory(input, result) {
            var newHistory = result ? input + '\n  ' + result.replace(/\n/g, '\n  ') : input;
            this.history.setValue(this.history.getValue() + '\n> ' + newHistory);
            this.history.scrollTo(null, this.history.getScrollInfo().height);
        }
    }, {
        key: 'goToPostState',
        value: function goToPostState() {
            this.editor.getWrapperElement().parentNode.removeChild(this.editor.getWrapperElement());
            this.history.getWrapperElement().parentNode.removeChild(this.history.getWrapperElement());
            document.getElementById('codeMirrorDiv').style.display = 'none';
            if (this.isNotFirstRun) {
                this.state.start('Game', true, false, true);
                return;
            }
            this.state.start('Post');
        }
    }, {
        key: 'evaluateCall',
        value: function evaluateCall(command) {
            try {
                return '' + eval.call(this, command);
            } catch (err) {
                return err.message;
            }
        }
    }, {
        key: 'setupCharacters',
        value: function setupCharacters() {
            robby.init(this);
            enemy.init(this);
        }
    }, {
        key: 'setupParts',
        value: function setupParts() {
            leftArm.init(this);
            rightArm.init(this);
            antenna.init(this);
        }
    }, {
        key: 'setupArrows',
        value: function setupArrows() {
            var arrowBG = this.add.sprite(930, 360, 'arrowBG');
            arrowBG.scale.setTo(0.25, 0.25);
            arrowBG.anchor.setTo(0.5, 0.5);
            var up = this.add.button(930, 325, 'upArrow', this.pressUpArrow, this);
            var right = this.add.button(965, 360, 'rightArrow', this.pressRightArrow, this);
            var down = this.add.button(930, 395, 'downArrow', this.pressDownArrow, this);
            var left = this.add.button(895, 360, 'leftArrow', this.pressLeftArrow, this);
            up.anchor.setTo(0.5, 0.5);
            right.anchor.setTo(0.5, 0.5);
            down.anchor.setTo(0.5, 0.5);
            left.anchor.setTo(0.5, 0.5);
            up.scale.setTo(0.25, 0.25);
            right.scale.setTo(0.25, 0.25);
            down.scale.setTo(0.25, 0.25);
            left.scale.setTo(0.25, 0.25);

            this.addFloatFunctionToButton(up);
            this.addFloatFunctionToButton(right);
            this.addFloatFunctionToButton(down);
            this.addFloatFunctionToButton(left);

            this.time.events.add(2000, function () {
                this.blinkRightButton(right, true);
            }, this);
        }
    }, {
        key: 'addFloatFunctionToButton',
        value: function addFloatFunctionToButton(button) {
            button.onInputOver.add(function () {
                this.scale.setTo(0.3, 0.3);
            }, button);
            button.onInputOut.add(function () {
                this.scale.setTo(0.25, 0.25);
            }, button);
        }
    }, {
        key: 'blinkRightButton',
        value: function blinkRightButton(rightButton, makeBigger) {
            var iteration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            if (iteration > 5) return;
            var scale = makeBigger ? 0.3 : 0.25;
            rightButton.scale.setTo(scale, scale);
            iteration++;
            this.time.events.add(500, function () {
                this.blinkRightButton(rightButton, !makeBigger, iteration);
            }, this);
        }
    }, {
        key: 'pressRightArrow',
        value: function pressRightArrow() {
            if (this.editor.hasFocus()) return;
            this.editor.setValue('robby.goRight()');
            this.enterKeyDown();
        }
    }, {
        key: 'pressUpArrow',
        value: function pressUpArrow() {
            if (this.editor.hasFocus()) return;
            this.editor.setValue('robby.goUp()');
            this.enterKeyDown();
        }
    }, {
        key: 'pressDownArrow',
        value: function pressDownArrow() {
            if (this.editor.hasFocus()) return;
            this.editor.setValue('robby.goDown()');
            this.enterKeyDown();
        }
    }, {
        key: 'pressLeftArrow',
        value: function pressLeftArrow() {
            if (this.editor.hasFocus()) return;
            this.editor.setValue('robby.goLeft()');
            this.enterKeyDown();
        }
    }, {
        key: 'addTweenedSprite',
        value: function addTweenedSprite(spriteName, positionX, positionY, delay, endScale) {
            var sprite = this.getGroupBySpriteName(spriteName).create(positionX, positionY, spriteName);
            sprite.anchor.setTo(0.5, 0.5);
            sprite.scale.setTo(0, 0);
            this.add.tween(sprite.scale).to({ x: endScale, y: endScale }, 250, Phaser.Easing.Linear.In, true, delay);
            return sprite;
        }
    }, {
        key: 'addTweenedGridLine',
        value: function addTweenedGridLine(spriteName, positionX, positionY) {
            var horizontal = Math.random() >= 0.5;
            var signed = Math.random() >= 0.5;
            var sprite = this.getGroupBySpriteName(spriteName).create(positionX + (horizontal ? signed ? -1024 : 1024 : 0), positionY + (!horizontal ? signed ? -768 : 768 : 0), spriteName);
            var rotatedSprite = this.getGroupBySpriteName(spriteName).create(sprite.x, sprite.y, spriteName);
            sprite.anchor.setTo(0.5, 0.5);
            rotatedSprite.anchor.setTo(0.5, 0.5);
            sprite.angle = signed ? 180 : 0;
            sprite.alpha = signed ? 0 : 1;
            rotatedSprite.angle = signed ? 0 : 180;
            rotatedSprite.alpha = signed ? 1 : 0;
            var randomDelay = Math.floor(Math.random() * 500 + 1);
            this.add.tween(sprite).to({ x: positionX, y: positionY }, 750 - randomDelay, Phaser.Easing.Linear.In, true, randomDelay);
            this.add.tween(rotatedSprite).to({ x: positionX, y: positionY }, 750 - randomDelay, Phaser.Easing.Linear.In, true, randomDelay);
            this.add.tween(sprite).to({ alpha: signed ? 1 : 0 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
            this.add.tween(rotatedSprite).to({ alpha: signed ? 0 : 1 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
        }
    }, {
        key: 'getGroupBySpriteName',
        value: function getGroupBySpriteName(spriteName) {
            switch (spriteName) {
                case 'vertLine':
                case 'horLine':
                case 'circle':
                    return this.gridGroup;
                case 'exit':
                    return this.exitGroup;
                case 'badrobot':
                    return this.badrobotGroup;
                case 'robby':
                case 'l':
                case 'r':
                case 'a':
                case 'robbyeyeleft':
                case 'robbyeyeright':
                    return this.robbyGroup;
            }
        }
    }, {
        key: 'postNewSession',
        value: function postNewSession() {
            var recId = this.getUrlParameter('recId');
            $.ajax({
                url: window.location.origin + '/newSession',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ 'level': gridGenerator.levelString, 'recId': recId })
            });
        }
    }, {
        key: 'postInput',
        value: function postInput(input) {
            $.ajax({
                url: window.location.origin + '/input',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ 'input': input + '\n' })
            });
        }
    }, {
        key: 'getUrlParameter',
        value: function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        }
    }]);

    return Game;
}();

Prato.Game = new Game();