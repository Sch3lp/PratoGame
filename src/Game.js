Prato.Game = function(game){
		this.terminalHistory = ['', '', ''];
		this.arrowHistory = ['   ', '   ', ' > '];
		this.startText = ['WELCOME TO THE PRATO ROBBY ASSEMBLING TOOL OPERATOR', 'ALSO KNOWN AS P.R.A.T.O.', 'PLEASE REASSEMBLE ROBBY'];
		this.input;
		this.lastSaidStuff;
		this.otherArrows;
};
Prato.Game.prototype = {
	create: function(){
		this.stage.backgroundColor = "#383838";

		var arrows = this.add.sprite(910, 475, 'arrows');
		arrows.anchor.setTo(0.5, 0.5);
		arrows.scale.setTo(0.2, 0.2);

		this.add.sprite(0, 600, 'divider');
		this.setupGrid();
		this.input = this.add.inputField(32, 718,{
			width: 960,
			height: 20,
			font: '20px Courier',
			backgroundColor: '#000000',
			fill: '#FFFFFF',
			cursorColor: '#FFFFFF',
			fillAlpha: 0,
		});

		this.input.startFocus();
		var me = this;
		this.input.keyListener = function (evt) {
			this.value = this.domElement.value;
			if (evt.keyCode === 13) {
				me.keyDown();
			}
			this.updateText();
			this.updateCursor();
			this.updateSelection();
			evt.preventDefault();
		};

		this.otherArrows = this.add.text(0, 638, this.arrowHistory.join('\n'), { font: "20px Courier", fill: "#FFFFFF" });
		this.lastSaidStuff = this.add.text(32, 638, this.terminalHistory.join('\n'), { font: "20px Courier", fill: "#FFFFFF" });
		var typeInArrow = this.add.text(0, 718, ' > ', { font: "20px Courier", fill: "#FFFFFF" });

		this.typeDelayed(this.startText.join('\n'));
	},
	update: function () {
	},
	keyDown: function () {
		// Add new > line
		this.arrowHistory.splice(0,1);
		this.arrowHistory.push(' > ');
		this.otherArrows.setText(this.arrowHistory.join('\n'))

		// Throw away oldest line and provide clear new line
		this.terminalHistory.push('');
		this.terminalHistory.splice(0,1);
		this.lastSaidStuff.setText(this.terminalHistory.join('\n'));

		var result = this.evaluateCall(this.input.value);

		this.typeDelayed(this.input.value + '\n' + result);
		this.input.resetText();
		this.input.startFocus();
	},

	typeDelayed: function (typeLeft) {
			if(typeLeft[0] && typeLeft[0] === '\n'){
				this.terminalHistory.splice(0,1);
				this.terminalHistory.push('');
				this.lastSaidStuff.setText(this.terminalHistory.join('\n'));
				this.updateArrows();
			} else{
				this.lastSaidStuff.setText(this.lastSaidStuff._text + typeLeft[0]);
				this.terminalHistory[2] += typeLeft[0];
			}
			if(typeLeft.substring(1).length === 0) return;
			this.time.events.add(25, this.typeDelayed, this, typeLeft.substring(1));
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
		this.arrowHistory.splice(0,1);
		this.arrowHistory.push('   ');
		this.otherArrows.setText(this.arrowHistory.join('\n'))

	},
	setupGrid (){
		var level = this.getLevelString();
		var oneLineLevel = level.replace(/(\r\n|\n|\r)/gm,"");
		const offset = 50;
		const columns = Math.max(...level.split('\n').map((line)=>line.length));
		const rows = level.split('\n').length;
		const columnWidth = (this.world.width - 200) / columns;
		const rowWidth = this.world.height / rows;
		const finalRadius = Math.min(columnWidth, rowWidth);

		for(var i = 0; i < rows; i++){
				for(var j = 0; j < columns; j++){
					if(oneLineLevel[i * columns + j] === '-'){
						var circle = this.add.sprite(offset + j * finalRadius, offset + i * finalRadius, 'line');
						circle.anchor.setTo(0.5, 0.5);
						circle.scale.setTo(0.1, 0.1);
					} else if(oneLineLevel[i * columns + j] === 'o'){
						var circle = this.add.sprite(offset + j * finalRadius, offset + i * finalRadius, 'circle');
						circle.anchor.setTo(0.5, 0.5);
						circle.scale.setTo(0.02, 0.02);
					} else if(oneLineLevel[i * columns + j] === '|'){
						var circle = this.add.sprite(offset + j * finalRadius, offset + i * finalRadius, 'line');
						circle.anchor.setTo(0.5, 0.5);
						circle.scale.setTo(0.1, 0.1);
						circle.angle = 90;
					}
			}
		}

		var robby = this.add.sprite(offset, offset, 'robby');
		robby.anchor.setTo(0.5, 0.5);
		robby.scale.setTo(0.2, 0.2);

		var badRobot = this.add.sprite(650, 325, 'badrobot');
		badRobot.anchor.setTo(0.5, 0.5);
		badRobot.scale.setTo(0.5, 0.5);

    anim = badRobot.animations.add('blink');
		anim.play(5, true);
	},
	getLevelString (){
		var level = "o-oa  o-o-o\n\
  |   | | |\n\
o-o o-o o-o\n\
|   |   | |\n\
o-o-o   o-o\n\
  |       c\n\
  o-ob     ";
		return level;
	}
};
