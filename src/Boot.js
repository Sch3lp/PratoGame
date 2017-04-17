var Prato = {};
Prato.Boot = function(game){};
Prato.Boot.prototype = {
	preload: function(){
	},
	create: function(){
		this.state.start('Preloader');
	}
};