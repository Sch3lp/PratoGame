Prato.Game = function(game){
		this.arrowHistory = ['   ', '   ', '   ', '   ', ' < '];
		this.startText = ['---------------------------------------------------', 'WELCOME TO THE PRATO ROBBY ASSEMBLING TOOL OPERATOR', 'ALSO KNOWN AS P.R.A.T.O.', 'PLEASE REASSEMBLE ROBBY', '---------------------------------------------------'];
		this.otherArrows;
		this.robbySprite;
		this.editor;
		this.history;
};
Prato.Game.prototype = {
	create: function(){
		console.log = (value) => value;

		this.stage.backgroundColor = "#383838";

		this.add.sprite(0, 446, 'divider');
		gridGenerator.setupGrid(this);
		this.setupCharacters();
		this.setupArrows();

		var inputField = document.getElementById("commandInput");
		this.editor = CodeMirror.fromTextArea(inputField, {
        mode:  "javascript",
				theme: 'night'
    });
		var historyField = document.getElementById("historyTextArea");
		this.history = CodeMirror.fromTextArea(historyField, {
        mode:  "javascript",
				theme: 'night',
				readOnly: true,
				scrollbarStyle: 'simple'
    });

		this.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.enterKeyDown, this);
		this.shiftKey = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

		this.otherArrows = this.add.text(0, 484, this.arrowHistory.join('\n'), { font: "20px Courier", fill: "#FFFFFF" });
		var typeInArrow = this.add.text(0, 618, ' > ', { font: "20px Courier", fill: "#FFFFFF" });

		this.typeDelayed(this.startText.join('\n'));
	},
	update: function () {
	},
	enterKeyDown: function () {
		var input = this.editor.getValue();
		if(input.trim() === ''){
			this.editor.setValue('');
			return;
		}
		if(this.shiftKey.isDown){
			var newCursorPosition = this.editor.getCursor();
			this.editor.setValue(input + '\n');
			newCursorPosition.line++;
			newCursorPosition.ch = 0;
			this.editor.setCursor(newCursorPosition);
			return;
		}
		if(input[input.length - 1] === '\n') input = input.slice(0, -1);
		// Add new > line
		this.arrowHistory.splice(0,1);
		this.arrowHistory.push(' < ');
		this.otherArrows.setText(this.arrowHistory.join('\n'))

		var result = this.evaluateCall(input);

		this.typeDelayed('\n' + input + '\n' + result);
		this.editor.setValue('');
		return result;
	},

	typeDelayed: function (typeLeft) {
			if(typeLeft[0] === '\n'){
				this.arrowHistory.splice(0,1);
				this.arrowHistory.push('   ');
				this.otherArrows.setText(this.arrowHistory.join('\n'))
			}
			this.history.setValue(this.history.getValue() + typeLeft[0]);
			this.history.scrollTo(null, this.history.getScrollInfo().height);
			if(typeLeft.substring(1).length === 0) return;
			this.time.events.add(15, this.typeDelayed, this, typeLeft.substring(1));
	},
	evaluateCall: function (command){
		try {
			return '' + eval.call(this, command);
		}
		catch(err) {
			return err.message;
		}
	},
	updateArrows: function (){
		this.arrowHistory.splice(0, 1);
		this.arrowHistory.push('   ');
		this.otherArrows.setText(this.arrowHistory.join('\n'))

	},
	setupCharacters (){
		const rows = gridGenerator.levelGrid.length;
		const columns = gridGenerator.levelGrid[0].length;
		const offset = 50;
		const columnWidth = (this.world.width - 200) / columns;
		const rowHeight = this.world.height / rows;
		const finalRadius = Math.min(columnWidth, rowHeight);

		this.robbySprite = this.addTweenedSprite('robby', offset, offset, 10 * columns * rows, 0.2);

		var badRobot = this.addTweenedSprite('badrobot', 470, 250, 10 * columns * rows, 0.5);
    var anim = badRobot.animations.add('blink');
		anim.play(5, true);
	},
	setupArrows (){
		this.add.button(910, 325, 'upArrow', this.pressUpArrow, this);
		this.add.button(945, 360, 'rightArrow', this.pressRightArrow, this);
		this.add.button(910, 395, 'downArrow', this.pressDownArrow, this);
		this.add.button(875, 360, 'leftArrow', this.pressLeftArrow, this);
	},
	pressRightArrow (){
		this.editor.setValue('robby.goRight()');
		var result = this.enterKeyDown();
		if(result === 'GOING') this.robbyGo(robby.navigation.x, robby.navigation.y);
	},
	pressUpArrow (){
		this.editor.setValue('robby.goUp()');
		var result = this.enterKeyDown();
		if(result === 'GOING') this.robbyGo(robby.navigation.x, robby.navigation.y);
	},
	pressDownArrow (){
		this.editor.setValue('robby.goDown()');
		var result = this.enterKeyDown();
		if(result === 'GOING') this.robbyGo(robby.navigation.x, robby.navigation.y);
	},
	pressLeftArrow (){
		this.editor.setValue('robby.goLeft()');
		var result = this.enterKeyDown();
		if(result === 'GOING') this.robbyGo(robby.navigation.x, robby.navigation.y);
	},
	robbyGo(x, y){
		const rows = gridGenerator.levelGrid.length;
		const columns = gridGenerator.levelGrid[0].length;
		const offset = 50;
		const columnWidth = (this.world.width - 200) / columns;
		const rowHeight = (this.world.height - 400) / rows;
		const finalRadius = Math.min(columnWidth, rowHeight);
		this.add.tween(this.robbySprite).to( { x: this.robbySprite.x + finalRadius * x * 2, y: this.robbySprite.y - finalRadius * y * 2 }, 250, Phaser.Easing.Linear.In, true);
		this.add.tween(this.robbySprite.scale).to( { x: this.robbySprite.scale.x * 0.8, y: this.robbySprite.scale.y * 0.8 }, 125, Phaser.Easing.Linear.InOut, true).yoyo(true);
	},
	addTweenedSprite (spriteName, positionX, positionY, delay, endScale){
		var sprite = this.add.sprite(positionX, positionY, spriteName);
		sprite.anchor.setTo(0.5, 0.5);
		sprite.scale.setTo(0, 0);
		this.add.tween(sprite.scale).to({x: endScale, y: endScale}, 500, Phaser.Easing.Linear.In, true, delay);
		return sprite;
	}
};
