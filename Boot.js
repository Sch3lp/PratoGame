var Prato = {};
Prato.Boot = function(game){};
Prato.Boot.prototype = {
	preload: function(){
	},
	create: function(){
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.state.start('Preloader');
	}
};