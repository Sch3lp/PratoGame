Prato.Preloader = function(game){};
Prato.Preloader.prototype = {
	preload: function(){
      this.load.image('robby', 'Robby.png');
      this.load.image('divider', 'Divider.png');
			this.add.plugin(PhaserInput.Plugin);
	},
	create: function(){
		this.state.start('Game');
	}
};
