class Magnet {
    constructor() {
        this.isActive = false
    }
    activate() {
        this.isActive = true
        return 'Magnet activated!'
    }
}
class Attachable {
    constructor(element) {
        this.isAttachable = true
        this.magnet = new Magnet()
        this.element = element
        this.sprite
    }
    init(game) {
        const position = gridGenerator.getPositionOfElementInPixels(this.element)
        this.sprite = game.addTweenedSprite(this.element, position.x, position.y, 1000, 0.3)
    }
}
const leftArm = new Attachable('l')
const rightArm = new Attachable('r')
const antenna = new Attachable('a')