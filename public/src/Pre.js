class Pre {
    create() {
        const music = this.add.audio('theme')
        music.play()
        const callback = () => {
            this.input.keyboard.onDownCallback = null
            $("#titleImage").hide()
            this.state.start('Game')
        }
        this.input.keyboard.onDownCallback = callback
        $("#titleImage").click(callback)
    }

}

Prato.Pre = new Pre()