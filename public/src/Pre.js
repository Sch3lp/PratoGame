class Pre {
    create() {
        const music = this.add.audio('theme')
        music.play()
        this.input.keyboard.onDownCallback = () => {
            this.input.keyboard.onDownCallback = null
            $("#titleImage").hide()
            this.state.start('Game')
        }
    }
}

Prato.Pre = new Pre()