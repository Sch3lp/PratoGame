Prato.Preloader = function(game){};
Prato.Preloader.prototype = {
	preload: function(){
            this.load.image('logo', 'Robby.png');
			this.add.plugin(PhaserInput.Plugin);
	},
	create: function(){
		this.state.start('Game');
	}
};