Prato.Preloader = function(game){};
Prato.Preloader.prototype = {
	preload: function(){
      this.load.image('robby', 'Robby.png');
      this.load.image('divider', 'Divider.png');
      this.load.image('circle', 'Circle.png');
      this.load.image('line', 'Line.png');
      this.load.image('arrows', 'Arrows.png');
			this.load.spritesheet('badrobot', 'BadRobot3.png', 178, 178, 2);
			this.add.plugin(PhaserInput.Plugin);
	},
	create: function(){
		this.state.start('Game');
	}
};
