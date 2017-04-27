class Post {
    create() {
        document.getElementById('postFormDiv').style.display = 'block'

        this.input.keyboard.removeKey(Phaser.Keyboard.DOWN)
        this.input.keyboard.removeKey(Phaser.Keyboard.UP)
    }
}

Prato.Post = new Post()