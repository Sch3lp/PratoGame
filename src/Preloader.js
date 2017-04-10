Prato.Preloader = function(game){};
Prato.Preloader.prototype = {
	preload: function(){
      this.load.image('robby', 'Robby.png');
      this.load.image('divider', 'Divider.png');
      this.load.image('circle', 'Circle.png');
      this.load.image('horLine', 'HorLine.png');
      this.load.image('vertLine', 'VertLine.png');
      this.load.image('upArrow', 'Up.png');
      this.load.image('rightArrow', 'Right.png');
      this.load.image('downArrow', 'Down.png');
      this.load.image('leftArrow', 'Left.png');
			this.load.spritesheet('badrobot', 'BadRobot3.png', 178, 178, 2);
			this.add.plugin(PhaserInput.Plugin);
	},
	create: function(){
		this.state.start('Game');
	}
};
