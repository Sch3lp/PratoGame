Prato.Game = function(game){
		this.terminalHistory = ['', '', ''];
		this.terminalHistory2 = ['WELCOME TO THE PRATO ROBBY ASSEMBLING TOOL OPERATOR', 'ALSO KNOWN AS P.R.A.T.O.', 'PLEASE REASSEMBLE ROBBY'];
		this.input;
		this.lastSaidStuff;
};
Prato.Game.prototype = {
	create: function(){
		var logo = this.add.sprite(this.world.centerX, this.world.centerY, 'logo');
		logo.anchor.setTo(0.5, 0.5);
		this.input = this.add.inputField(32, 550,{
			width: 736,
			height: 20,
			font: '20px Courier',
			backgroundColor: '#000000',
			backgroundColor: '#000000',
			fill: '#00FF00',
			cursorColor: '#00FF00',
			fillAlpha: 0,
		});

		this.input.startFocus();
		var me = this;
		this.input.keyListener = function (evt) {
			this.value = this.domElement.value;
			if (evt.keyCode === 13) {
				me.keyDown().bind(me);
			}
			this.updateText();
			this.updateCursor();
			this.updateSelection();
			evt.preventDefault();
		};

		var otherArrows = this.add.text(0, 470, ' > \n > \n > ', { font: "20px Courier", fill: "#00FF00" });
		this.lastSaidStuff = this.add.text(32, 470, this.terminalHistory.join('\n'), { font: "20px Courier", fill: "#00FF00" });
		var typeInArrow = this.add.text(0, 550, ' > ', { font: "20px Courier", fill: "#00FF00" });

		this.typeDelayed(this.terminalHistory2.join('\n'));
	},
	update: function () {
	},
	keyDown: function () {
			var result = this.evaluateCall(this.input.value);
			this.typeDelayed('\n' + this.input.value + '\n' + result);
			this.input.resetText();
			this.input.startFocus();
	},

	typeDelayed: function (typeLeft) {
			if(typeLeft[1] && typeLeft[0] === '\n'){
						this.terminalHistory.splice(0,1);
						this.terminalHistory.push('');
						this.lastSaidStuff.setText(this.terminalHistory.join('\n'));
			} else{
				this.lastSaidStuff.setText(this.lastSaidStuff._text + typeLeft[0]);
				this.terminalHistory[2] += typeLeft[0];
			}
			if(typeLeft.substring(1).length === 0) return;
			this.time.events.add(25, this.typeDelayed, this, typeLeft.substring(1));
	},

	evaluateCall: function (command){
		return '' + eval.call(this, command);
	}
};
