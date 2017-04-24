Prato.Post = function (game) {

};
Prato.Post.prototype = {
	create: function () {        
		this.add.sprite(0, 0, 'bg');
		document.getElementById("postFormDiv").style.display = 'block';
	},
	update: function () {

	}
};