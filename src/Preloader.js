Prato.Preloader = function(game){};
Prato.Preloader.prototype = {
	preload: function(){
      this.load.image('robby', 'img/Robby.png');
      this.load.image('circle', 'img/Circle.png');
      this.load.image('horLine', 'img/HorLine.png');
      this.load.image('vertLine', 'img/VertLine.png');
      this.load.image('upArrow', 'img/Up.png');
      this.load.image('rightArrow', 'img/Right.png');
      this.load.image('downArrow', 'img/Down.png');
      this.load.image('leftArrow', 'img/Left.png');
      this.load.image('dust', 'img/Dust.png');
      this.load.image('dustRed', 'img/DustRed.png');
      this.load.image('bg', 'img/BG.png');
      this.load.image('robbyleft', 'img/RobbyLeft.png');
      this.load.image('robbyright', 'img/RobbyRight.png');
      this.load.image('robbyantenna', 'img/RobbyAntenna.png');
      this.load.image('robbyeyeleft', 'img/RobbyEyeLeft.png');
      this.load.image('robbyeyeright', 'img/RobbyEyeRight.png');
			this.load.spritesheet('badrobot', 'img/BadRobot.png', 178, 178, 2);
	},
	create: function(){
		this.state.start('Game');
	}
};
