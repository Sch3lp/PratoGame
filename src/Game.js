Prato.Game = function (game) {
	this.startText =
'---------------------------------------------------\n\
WELCOME TO THE PRATO ROBBY ASSEMBLING TOOL OPERATOR\n\
ALSO KNOWN AS P.R.A.T.O.\n\
PLEASE REASSEMBLE ROBBY\n\
---------------------------------------------------';
	this.editor;
	this.history;
};
Prato.Game.prototype = {
	create: function () {		
		this.add.sprite(0, 0, 'bg');

		gridGenerator.setupGrid(this);
		this.setupCharacters();
		this.setupParts();
		this.setupArrows();

		document.getElementById("codeMirrorDiv").style.display = 'block';
		var inputField = document.getElementById("commandInput");
		this.editor = CodeMirror.fromTextArea(inputField, { mode: "javascript", theme: 'night', scrollbarStyle: 'simple' });
		var historyField = document.getElementById("historyTextArea");
		this.history = CodeMirror.fromTextArea(historyField, {
			mode: "javascript",
			theme: 'night',
			readOnly: true,
			scrollbarStyle: 'simple',
			lineWrapping: true
		});

		this.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.enterKeyDown, this);
		this.shiftKey = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

		this.history.setValue(this.startText);
	},
	update: function () {
		const mousePositionX = this.input.mousePointer.x;
		const mousePositionY = this.input.mousePointer.y;

		const xDiffLeft = mousePositionX - (robby.sprite.x - 15);
		const xDiffRight = mousePositionX - (robby.sprite.x + 15);
		const yDiff = mousePositionY - (robby.sprite.y - 27);

		var angleLeft = Math.atan2(yDiff, xDiffLeft);
		var angleRight = Math.atan2(yDiff, xDiffRight);
		// this.editor.setValue('' + mousePositionX + ', ' + mousePositionY + '\n' + robby.sprite.x + ', ' + (robby.sprite.y - 27));
		robby.leftEye.rotation = angleLeft;
		robby.rightEye.rotation = angleRight;

	},
	enterKeyDown: function () {
		var input = this.editor.getValue();
		if (this.shiftKey.isDown) {
			this.makeNewLineAtCursorAndRememberCursorPosition(input);
			return;
		}
		var input = this.editor.getValue();
		if (input.trim() === '') {
			this.editor.setValue('');
			return;
		}
		if (input[input.length - 1] === '\n') input = input.slice(0, -1);

		var result = this.evaluateCall(input);

		this.setHistory(input, result);
		this.editor.setValue('');
		return result;
	},

	makeNewLineAtCursorAndRememberCursorPosition: function (input) {
		var newCursorPosition = this.editor.getCursor();
		const splittedInput = input.split('\n');
		const splittedLineWhereCursorIs = splittedInput[newCursorPosition.line];
		splittedInput[newCursorPosition.line] = [splittedLineWhereCursorIs.slice(0, newCursorPosition.ch), "\n", splittedLineWhereCursorIs.slice(newCursorPosition.ch)].join('');
		this.editor.setValue(splittedInput.join('\n'));
		newCursorPosition.line++;
		newCursorPosition.ch = 0;
		this.editor.setCursor(newCursorPosition);
	},

	setHistory: function (input, result) {
		this.history.setValue(this.history.getValue() + '\n> ' + input + '\n  ' + result.replace(/\n/g, "\n  "));
		this.history.scrollTo(null, this.history.getScrollInfo().height);
	},

	evaluateCall: function (command) {
		try {
			return '' + eval.call(this, command);
		}
		catch (err) {
			return err.message;
		}
	},
	setupCharacters() {
		const rows = gridGenerator.levelGrid.length;
		const columns = gridGenerator.levelGrid[0].length;
		const offset = 50;
		const columnWidth = (this.world.width - 200) / columns;
		const rowHeight = this.world.height / rows;
		const finalRadius = Math.min(columnWidth, rowHeight);

		robby.init(this);
		enemy.init(this);

	},
	setupParts() {
		leftArm.init(this);
		rightArm.init(this);
		antenna.init(this);

	},
	setupArrows() {
		this.add.button(910, 325, 'upArrow', this.pressUpArrow, this);
		this.add.button(945, 360, 'rightArrow', this.pressRightArrow, this);
		this.add.button(910, 395, 'downArrow', this.pressDownArrow, this);
		this.add.button(875, 360, 'leftArrow', this.pressLeftArrow, this);
	},
	pressRightArrow() {
		this.editor.setValue('robby.goRight()');
		this.enterKeyDown();
	},
	pressUpArrow() {
		this.editor.setValue('robby.goUp()');
		this.enterKeyDown();
	},
	pressDownArrow() {
		this.editor.setValue('robby.goDown()');
		this.enterKeyDown();
	},
	pressLeftArrow() {
		this.editor.setValue('robby.goLeft()');
		this.enterKeyDown();
	},
	addTweenedSprite(spriteName, positionX, positionY, delay, endScale) {
		var sprite = this.add.sprite(positionX, positionY, spriteName);
		sprite.anchor.setTo(0.5, 0.5);
		sprite.scale.setTo(0, 0);
		this.add.tween(sprite.scale).to({ x: endScale, y: endScale }, 500, Phaser.Easing.Linear.In, true, delay);
		return sprite;
	}
};
