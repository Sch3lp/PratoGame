Prato.Game = function(game){
		this.arrowHistory = ['   ', '   ', '   ', '   ', ' < '];
		this.startText = ['---------------------------------------------------', 'WELCOME TO THE PRATO ROBBY ASSEMBLING TOOL OPERATOR', 'ALSO KNOWN AS P.R.A.T.O.', 'PLEASE REASSEMBLE ROBBY', '---------------------------------------------------'];
		this.otherArrows;
		this.levelGrid = this.createGrid();
		this.robbySprite;
		this.editor;
		this.history;
};
Prato.Game.prototype = {
	create: function(){
		console.log = (value) => value;

		this.stage.backgroundColor = "#383838";

		this.add.sprite(0, 446, 'divider');
		this.setupGrid();
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
	createGrid (){
		var level = this.getLevelString();
		var oneLineLevel = level.replace(/(\r\n|\n|\r)/gm,"");
		const offset = 50;
		const columns = Math.max(...level.split('\n').map((line)=>line.length));
		const rows = level.split('\n').length;

		var grid = this.createArray(rows, columns)

		for(var i = 0; i < rows; i++){
				for(var j = 0; j < columns; j++){
					grid[i][j] = oneLineLevel[i * columns + j];
			}
		}
		return grid;
	},
	setupGrid (){
		const rows = this.levelGrid.length;
		const columns = this.levelGrid[0].length;
		const offset = 50;
		const columnWidth = (this.world.width - 200) / columns;
		const rowHeight = (this.world.height - 400) / rows;
		const finalRadius = Math.min(columnWidth, rowHeight);

		for(var i = 0; i < rows; i++){
				for(var j = 0; j < columns; j++){
					var spriteName = this.getGridSpriteForCharacter(this.levelGrid[i][j]);
					this.addTweenedSprite(spriteName, offset + j * finalRadius, offset + i * finalRadius, 10 * i * columns + j, 1);
			}
		}
	},
	getGridSpriteForCharacter(character){
		switch(character){
			case 'o':
			case 'R':
			case 'E':
				return 'circle';
			case '-':
				return 'horLine';
			case '|':
				return 'vertLine';
		}
	},
	setupCharacters (){
		const rows = this.levelGrid.length;
		const columns = this.levelGrid[0].length;
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
		this.editor.setValue('Robby.goRight()');
		var result = this.enterKeyDown();
		if(result === 'GOING') this.robbyGo(Robby.navigation.x, Robby.navigation.y);
	},
	pressUpArrow (){
		this.editor.setValue('Robby.goUp()');
		var result = this.enterKeyDown();
		if(result === 'GOING') this.robbyGo(Robby.navigation.x, Robby.navigation.y);
	},
	pressDownArrow (){
		this.editor.setValue('Robby.goDown()');
		var result = this.enterKeyDown();
		if(result === 'GOING') this.robbyGo(Robby.navigation.x, Robby.navigation.y);
	},
	pressLeftArrow (){
		this.editor.setValue('Robby.goLeft()');
		var result = this.enterKeyDown();
		if(result === 'GOING') this.robbyGo(Robby.navigation.x, Robby.navigation.y);
	},
	robbyGo(x, y){
		const rows = this.levelGrid.length;
		const columns = this.levelGrid[0].length;
		const offset = 50;
		const columnWidth = (this.world.width - 200) / columns;
		const rowHeight = this.world.height / rows;
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
	},
	getLevelString (){
		var level = "R-oa  o-o-o\n\
  |   | | |\n\
o-o o-o o-o\n\
|   |   | |\n\
o-o-o   E-o\n\
  |       c\n\
  o-ob     ";
		return level;
	},
	createArray (length){
    var arr = new Array(length || 0);
    var i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = this.createArray.apply(this, args);
    }

    return arr;
	}
};
