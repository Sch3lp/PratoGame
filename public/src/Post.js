class Post {
    create() {
        $("#postForm").submit((e) => {
            $.post(window.location.href + 'playerinfo', $('#postForm').serialize())
            e.preventDefault()
        })
        
        document.getElementById('postFormDiv').style.display = 'block'

        this.input.keyboard.removeKey(Phaser.Keyboard.DOWN)
        this.input.keyboard.removeKey(Phaser.Keyboard.UP)
    }
}

Prato.Post = new Post()