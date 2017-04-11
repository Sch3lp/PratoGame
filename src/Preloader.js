Prato.Preloader = function(game){};
Prato.Preloader.prototype = {
	preload: function(){
      this.load.image('robby', 'img/Robby.png');
      this.load.image('divider', 'img/Divider.png');
      this.load.image('circle', 'img/Circle.png');
      this.load.image('horLine', 'img/HorLine.png');
      this.load.image('vertLine', 'img/VertLine.png');
      this.load.image('upArrow', 'img/Up.png');
      this.load.image('rightArrow', 'img/Right.png');
      this.load.image('downArrow', 'img/Down.png');
      this.load.image('leftArrow', 'img/Left.png');
			this.load.spritesheet('badrobot', 'img/BadRobot.png', 178, 178, 2);
			this.add.plugin(PhaserInput.Plugin);
	},
	create: function(){
		this.state.start('Game');
	}
};
