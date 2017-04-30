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
    }
    init(isNotFirstRun) {
        this.isNotFirstRun = isNotFirstRun
    }
    create() {
        if (!this.isNotFirstRun) {
            const music = this.add.audio('theme')
            music.play()
        }
        this.add.sprite(0, 0, 'bg')

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
            }
        })
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
        this.history.setValue(this.history.getValue() + '\n> ' + input + '\n  ' + result.replace(/\n/g, '\n  '))
        this.history.scrollTo(null, this.history.getScrollInfo().height)
    }
    goToPostState() {
        this.editor.getWrapperElement().parentNode.removeChild(this.editor.getWrapperElement());
        this.history.getWrapperElement().parentNode.removeChild(this.history.getWrapperElement());
        document.getElementById('codeMirrorDiv').style.display = 'none'
        if (this.isNotFirstRun){
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
        this.add.button(910, 325, 'upArrow', this.pressUpArrow, this)
        this.add.button(945, 360, 'rightArrow', this.pressRightArrow, this)
        this.add.button(910, 395, 'downArrow', this.pressDownArrow, this)
        this.add.button(875, 360, 'leftArrow', this.pressLeftArrow, this)
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
        const sprite = this.add.sprite(positionX, positionY, spriteName)
        sprite.anchor.setTo(0.5, 0.5)
        sprite.scale.setTo(0, 0)
        this.add.tween(sprite.scale).to({ x: endScale, y: endScale }, 500, Phaser.Easing.Linear.In, true, delay)
        return sprite
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
