Prato.Post = function (game) {

};
Prato.Post.prototype = {
    create: function () {
        document.getElementById('postFormDiv').style.display = 'block';

        this.input.keyboard.removeKey(Phaser.Keyboard.DOWN);
        this.input.keyboard.removeKey(Phaser.Keyboard.UP);
    },
    update: function () {

    }
};