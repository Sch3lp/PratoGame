class Preloader {
    preload() {
        this.load.image('logo', 'img/Logo.png')
        this.load.image('robby', 'img/Robby.png')
        this.load.image('circle', 'img/Circle.png')
        this.load.image('horLine', 'img/HorLine.png')
        this.load.image('vertLine', 'img/VertLine.png')
        this.load.image('upArrow', 'img/Up.png')
        this.load.image('rightArrow', 'img/Right.png')
        this.load.image('downArrow', 'img/Down.png')
        this.load.image('leftArrow', 'img/Left.png')
        this.load.image('arrowBG', 'img/ArrowBG.png')
        this.load.image('dust', 'img/Dust.png')
        this.load.image('dustRed', 'img/DustRed.png')
        this.load.image('bg', 'img/BG.png')
        this.load.image('bgPre', 'img/BGPre.png')
        this.load.image('l', 'img/RobbyLeft.png')
        this.load.image('r', 'img/RobbyRight.png')
        this.load.image('a', 'img/RobbyAntenna.png')
        this.load.image('robbyeyeleft', 'img/RobbyEyeLeft.png')
        this.load.image('robbyeyeright', 'img/RobbyEyeRight.png')
        this.load.image('exit', 'img/Exit.png')
        this.load.image('badrobot', 'img/BadRobot.png')
        this.load.audio('theme', 'audio/Theme.mp3')
    }
    create() {
        this.state.start('Pre')
    }
}

Prato.Preloader = new Preloader()