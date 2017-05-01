class Enemy {
    constructor() {
        this.game
        this.sprite
        this.emitter
        this.goingBack
        this.horizontal
    }
    activate() {
        this.isActive = true
        return 'Magnet activated!'
    }
    init(game) {
        this.game = game
        this.horizontal = this.shouldIMoveHorizontal()
        const enemyPixelPosition = gridGenerator.getPositionOfElementInPixels('E')

        this.emitter = game.add.emitter(enemyPixelPosition.x, enemyPixelPosition.y, 100)
        this.emitter.makeParticles('dustRed')
        this.emitter.setAlpha(1, 0, 500)
        this.emitter.setScale(0, 0.25, 0, 0.25, 500, Phaser.Easing.Quintic.Out)
        this.emitter.maxParticleSpeed = new Phaser.Point(50, 50)
        this.emitter.minParticleSpeed = new Phaser.Point(-50, -50)
        game.time.events.add(500, () => { this.emitter.start(false, 500, 10) }, this)

        this.game.badrobotGroup = this.game.add.group();
        this.sprite = game.addTweenedSprite('badrobot', enemyPixelPosition.x, enemyPixelPosition.y, 0, 0.5)
        const anim = this.sprite.animations.add('blink')
        anim.play(5, true)
    }
    go(x, y) {
        const enemyPosition = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y)
        const destination = gridGenerator.convertGridToPixels(enemyPosition.x + x * 2, enemyPosition.y + y * 2)

        const moveTween = this.game.add.tween(this.sprite).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true)
        this.game.add.tween(this.emitter).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true)
        this.game.add.tween(this.sprite.scale).to({ x: this.sprite.scale.x * 0.8, y: this.sprite.scale.y * 0.8 }, 125, Phaser.Easing.Linear.InOut, true).yoyo(true)

        moveTween.onComplete.add(enemy.getRobbyIfYouCan, this)
    }
    canYouGoThere(diffX, diffY) {
        const position = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y)
        return gridGenerator.levelGrid[position.x + diffX]
            && gridGenerator.levelGrid[position.x + diffX][position.y + diffY]
            && ['-', '|'].includes(gridGenerator.levelGrid[position.x + diffX][position.y + diffY])
    }
    notify() {
        if (this.horizontal) {
            this.goHorizontal()
        } else {
            this.goVertical()
        }
    }
    goHorizontal() {
        if (this.goingBack) {
            if (this.canYouGoThere(-1, 0)) {
                this.go(-1, 0)
            } else {
                this.goingBack = false
                this.go(1, 0)
            }

        } else {
            if (this.canYouGoThere(1, 0)) {
                this.go(1, 0)
            } else {
                this.goingBack = true
                this.go(-1, 0)
            }
        }
    }
    goVertical() {
        if (this.goingBack) {
            if (this.canYouGoThere(0, -1)) {
                this.go(0, -1)
            } else {
                this.goingBack = false
                this.go(0, 1)
            }

        } else {
            if (this.canYouGoThere(0, 1)) {
                this.go(0, 1)
            } else {
                this.goingBack = true
                this.go(0, -1)
            }
        }
    }
    getRobbyIfYouCan() {
        const robbyPosition = gridGenerator.convertPixelsToGrid(robby.sprite.x, robby.sprite.y)
        const enemyPosition = gridGenerator.convertPixelsToGrid(enemy.sprite.x, enemy.sprite.y)

        if (robbyPosition.x === enemyPosition.x && robbyPosition.y === enemyPosition.y) {
            const spawnPosition = gridGenerator.convertGridToPixels(0, 0)
            robby.sprite.x = spawnPosition.x
            robby.sprite.y = spawnPosition.y
            robby.emitter.x = spawnPosition.x
            robby.emitter.y = spawnPosition.y
        }
    }

    shouldIMoveHorizontal() {
        const gridPosition = gridGenerator.getPositionOfElementInGrid('E')
        var verticalNeighbours = []
        if (gridPosition.y > 0) verticalNeighbours.push(gridGenerator.levelGrid[gridPosition.x][gridPosition.y - 1])
        if (gridPosition.y + 1 < gridGenerator.levelGrid[0].length) verticalNeighbours.push(gridGenerator.levelGrid[gridPosition.x][gridPosition.y + 1])

        return !verticalNeighbours.includes("|")
    }
}

const enemy = new Enemy()