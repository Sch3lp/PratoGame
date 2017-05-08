class Game {
    constructor() {
        this.startText =
            '---------------------------------------------------\n\
PLEASE REASSEMBLE ROBBY AND LEAVE THE FACILITY\n\
INVOKE THE HELP FUNCTION IF YOU NEED A HAND\n\
---------------------------------------------------'
        this.editor
        this.history
        this.previousEntries = []
        this.previousEntryIndex = -1
        this.isNotFirstRun
        this.gridGroup
        this.exitGroup
        this.robbyGroup
        this.badrobotGroup
    }
    init(isNotFirstRun) {
        this.isNotFirstRun = isNotFirstRun
    }
    create() {
        this.add.sprite(0, 0, 'bg')
        this.gridGroup = this.add.group();
        this.exitGroup = this.add.group();

        gridGenerator.setupGrid(this)
        this.setupCharacters()
        this.setupParts()
        this.setupArrows()

        document.getElementById('codeMirrorDiv').style.display = 'block'
        const inputField = document.getElementById('commandInput')
        this.editor = CodeMirror.fromTextArea(inputField, {
            mode: 'javascript',
            theme: 'night',
            scrollbarStyle: 'simple',
            extraKeys: {
                Enter: this.enterKeyDown.bind(this)
            },
            styleActiveLine: true,
            matchBrackets: true
        })
        this.editor.on("change", this.checkForAttachDirective.bind(this))
        const historyField = document.getElementById('historyTextArea')
        this.history = CodeMirror.fromTextArea(historyField, {
            mode: 'javascript',
            theme: 'night',
            readOnly: true,
            scrollbarStyle: 'simple',
            lineWrapping: true
        })

        this.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.downKeyDown, this)
        this.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.upKeyDown, this)
        this.shiftKey = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT)

        this.history.setValue(this.startText)
    }
    update() {
        this.rollEyes()
    }
    rollEyes() {
        const mousePositionX = this.input.mousePointer.x
        const mousePositionY = this.input.mousePointer.y

        const xDiffLeft = mousePositionX - (robby.sprite.x - 15)
        const xDiffRight = mousePositionX - (robby.sprite.x + 15)
        const yDiff = mousePositionY - (robby.sprite.y - 27)

        const angleLeft = Math.atan2(yDiff, xDiffLeft)
        const angleRight = Math.atan2(yDiff, xDiffRight)
        robby.leftEye.rotation = angleLeft
        robby.rightEye.rotation = angleRight
    }
    downKeyDown() {
        const lastLine = this.editor.getValue().split('\n').length - 1
        if (this.previousEntryIndex === -1 || this.editor.getCursor().line !== lastLine) return
        this.editor.setValue(this.previousEntries[this.previousEntryIndex])
        this.previousEntryIndex = Math.min(this.previousEntries.length - 1, this.previousEntryIndex + 1)
    }
    upKeyDown() {
        if (this.previousEntryIndex === -1 || this.editor.getCursor().line !== 0) return
        this.editor.setValue(this.previousEntries[this.previousEntryIndex])
        this.previousEntryIndex = Math.max(0, this.previousEntryIndex - 1)
    }
    enterKeyDown() {
        var input = this.editor.getValue()
        if (input.trim() === '') {
            this.editor.setValue('')
            return
        }
        if (this.shiftKey.isDown) {
            this.makeNewLineAtCursorAndRememberCursorPosition(input)
            return
        }
        this.previousEntries.push(input)
        this.previousEntryIndex = this.previousEntries.length - 1
        if (input[input.length - 1] === '\n') input = input.slice(0, -1)

        const result = this.evaluateCall(input)

        this.setHistory(input, result)
        this.editor.setValue('')
        this.postInput(input)
    }
    checkForAttachDirective(cm, change) {
        const editorValue = this.editor.getValue()
        if (editorValue.includes("robby.attach") && !editorValue.includes("leftArm")
            && !editorValue.includes("rightArm")
            && !editorValue.includes("antenna")) {

            this.add.tween(leftArm.text).to({ alpha: 1}, 250, Phaser.Easing.Linear.In, true)
            this.add.tween(rightArm.text).to({ alpha: 1}, 250, Phaser.Easing.Linear.In, true)
            this.add.tween(antenna.text).to({ alpha: 1}, 250, Phaser.Easing.Linear.In, true)
        } else {
            this.add.tween(leftArm.text).to({ alpha: 0}, 250, Phaser.Easing.Linear.In, true)
            this.add.tween(rightArm.text).to({ alpha: 0}, 250, Phaser.Easing.Linear.In, true)
            this.add.tween(antenna.text).to({ alpha: 0}, 250, Phaser.Easing.Linear.In, true)
        }
    }
    makeNewLineAtCursorAndRememberCursorPosition(input) {
        const newCursorPosition = this.editor.getCursor()
        const splittedInput = input.split('\n')
        const splittedLineWhereCursorIs = splittedInput[newCursorPosition.line]
        splittedInput[newCursorPosition.line] = [splittedLineWhereCursorIs.slice(0, newCursorPosition.ch), '\n', splittedLineWhereCursorIs.slice(newCursorPosition.ch)].join('')
        this.editor.setValue(splittedInput.join('\n'))
        newCursorPosition.line++
        newCursorPosition.ch = 0
        this.editor.setCursor(newCursorPosition)
    }
    setHistory(input, result) {
        const newHistory = result ? input + '\n  ' + result.replace(/\n/g, '\n  ') : input
        this.history.setValue(this.history.getValue() + '\n> ' + newHistory)
        this.history.scrollTo(null, this.history.getScrollInfo().height)
    }
    goToPostState() {
        this.editor.getWrapperElement().parentNode.removeChild(this.editor.getWrapperElement());
        this.history.getWrapperElement().parentNode.removeChild(this.history.getWrapperElement());
        document.getElementById('codeMirrorDiv').style.display = 'none'
        if (this.isNotFirstRun) {
            this.state.start('Game', true, false, true)
            return;
        }
        this.state.start('Post')
    }
    evaluateCall(command) {
        try {
            return '' + eval.call(this, command)
        }
        catch (err) {
            return err.message
        }
    }
    setupCharacters() {
        robby.init(this)
        enemy.init(this)

    }
    setupParts() {
        leftArm.init(this)
        rightArm.init(this)
        antenna.init(this)
    }
    setupArrows() {
        var arrowBG = this.add.sprite(930, 360, 'arrowBG')
        arrowBG.scale.setTo(0.25, 0.25)
        arrowBG.anchor.setTo(0.5, 0.5)
        var up = this.add.button(930, 325, 'upArrow', this.pressUpArrow, this)
        var right = this.add.button(965, 360, 'rightArrow', this.pressRightArrow, this)
        var down = this.add.button(930, 395, 'downArrow', this.pressDownArrow, this)
        var left = this.add.button(895, 360, 'leftArrow', this.pressLeftArrow, this)
        up.anchor.setTo(0.5, 0.5)
        right.anchor.setTo(0.5, 0.5)
        down.anchor.setTo(0.5, 0.5)
        left.anchor.setTo(0.5, 0.5)
        up.scale.setTo(0.25, 0.25)
        right.scale.setTo(0.25, 0.25)
        down.scale.setTo(0.25, 0.25)
        left.scale.setTo(0.25, 0.25)
    }
    pressRightArrow() {
        this.editor.setValue('robby.goRight()')
        this.enterKeyDown()
        this.editor.focus()
    }
    pressUpArrow() {
        this.editor.setValue('robby.goUp()')
        this.enterKeyDown()
        this.editor.focus()
    }
    pressDownArrow() {
        this.editor.setValue('robby.goDown()')
        this.enterKeyDown()
        this.editor.focus()
    }
    pressLeftArrow() {
        this.editor.setValue('robby.goLeft()')
        this.enterKeyDown()
        this.editor.focus()
    }
    addTweenedSprite(spriteName, positionX, positionY, delay, endScale) {
        const sprite = this.getGroupBySpriteName(spriteName).create(positionX, positionY, spriteName)
        sprite.anchor.setTo(0.5, 0.5)
        sprite.scale.setTo(0, 0)
        this.add.tween(sprite.scale).to({ x: endScale, y: endScale }, 250, Phaser.Easing.Linear.In, true, delay)
        return sprite
    }
    addTweenedGridLine(spriteName, positionX, positionY) {
        const horizontal = Math.random() >= 0.5;
        const signed = Math.random() >= 0.5;
        const sprite = this.getGroupBySpriteName(spriteName).create(positionX + (horizontal ? signed ? -1024 : 1024 : 0), positionY + (!horizontal ? signed ? -768 : 768 : 0), spriteName)
        const rotatedSprite = this.getGroupBySpriteName(spriteName).create(sprite.x, sprite.y, spriteName)
        sprite.anchor.setTo(0.5, 0.5)
        rotatedSprite.anchor.setTo(0.5, 0.5)
        sprite.angle = signed ? 180 : 0
        sprite.alpha = signed ? 0 : 1
        rotatedSprite.angle = signed ? 0 : 180
        rotatedSprite.alpha = signed ? 1 : 0
        const randomDelay = Math.floor((Math.random() * 500) + 1)
        this.add.tween(sprite).to({ x: positionX, y: positionY }, 750 - randomDelay, Phaser.Easing.Linear.In, true, randomDelay);
        this.add.tween(rotatedSprite).to({ x: positionX, y: positionY }, 750 - randomDelay, Phaser.Easing.Linear.In, true, randomDelay);
        this.add.tween(sprite).to({ alpha: signed ? 1 : 0 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
        this.add.tween(rotatedSprite).to({ alpha: signed ? 0 : 1 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);
    }
    getGroupBySpriteName(spriteName) {
        switch (spriteName) {
            case 'vertLine':
            case 'horLine':
            case 'circle':
                return this.gridGroup
            case 'exit':
                return this.exitGroup
            case 'badrobot':
                return this.badrobotGroup
            case 'robby':
            case 'l':
            case 'r':
            case 'a':
            case 'robbyeyeleft':
            case 'robbyeyeright':
                return this.robbyGroup
        }
    }
    postInput(input) {
        $.ajax({
            url: window.location.href + 'input',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 'input': input + '\n' })
        })
    }
}

Prato.Game = new Game()
