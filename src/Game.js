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
		var robby = this.add.sprite(this.world.centerX, this.world.centerY, 'robby');
		this.add.sprite(0, 600, 'divider');
		robby.anchor.setTo(0.5, 0.5);
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

	}
};
