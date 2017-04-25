Prato.Pre = function (game) {

};
Prato.Pre.prototype = {
    create: function () {
        this.add.sprite(0, 0, 'bgPre');

        this.add.sprite(0, 0, 'logo');
        this.add.text(320, 355, 'Press any key to continue...');

        this.input.keyboard.onDownCallback = () => {
            this.input.keyboard.onDownCallback = null;
            this.state.start('Game');
        }

    },
    update: function () {

    }
};