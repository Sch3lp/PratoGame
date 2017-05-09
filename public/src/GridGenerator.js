class GridGenerator {
    constructor() {
        this.levelGrid
        this.gridRadius
        this.game
        this.levelId
    }
    createGrid() {
        const level = !this.game.isNotFirstRun ? this.getLevelString() : new RandomGridGenerator().generate()
        this.levelId = this.generateLevelId(level)
        const oneLineLevel = level.replace(/(\r\n|\n|\r)/gm, '')
        const columns = Math.max(...level.split('\n').map((line) => line.length))
        const rows = level.split('\n').length

        const grid = []

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (!grid[j]) grid[j] = []
                grid[j][i] = oneLineLevel[i * columns + j]
            }
        }
        return grid
    }
    setupGrid(game) {
        this.game = game
        this.levelGrid = this.createGrid()
        const rows = this.levelGrid[0].length
        const columns = this.levelGrid.length
        this.gridRadius = this.calculateGridRadius(game, rows, columns)
        const offset = 90

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if ([' ', 'r', 'l', 'a'].includes(this.levelGrid[j][i])) continue
                const spriteName = this.getGridSpriteForCharacter(this.levelGrid[j][i])
                if (['horLine', 'vertLine'].includes(spriteName)) {
                    game.addTweenedGridLine(spriteName, offset + j * this.gridRadius, offset + i * this.gridRadius)
                } else {
                    game.addTweenedSprite(spriteName, offset + j * this.gridRadius, offset + i * this.gridRadius, 750, 1)
                }
            }
        }
    }
    calculateGridRadius(game, rows, columns) {
        const columnWidth = (game.world.width - 200) / columns
        const rowHeight = (game.world.height - 425) / rows
        return Math.min(columnWidth, rowHeight)
    }
    generateLevelId(levelString) {
        let binaryLevelId = levelString
        binaryLevelId = binaryLevelId.replace(/\r?\n|\r/g, '')
        binaryLevelId = binaryLevelId.replace(/ /g, '000')
        binaryLevelId = binaryLevelId.replace(/\|/g, '001')
        binaryLevelId = binaryLevelId.replace(/-/g, '001')
        binaryLevelId = binaryLevelId.replace(/E/g, '010')
        binaryLevelId = binaryLevelId.replace(/e/g, '011')
        binaryLevelId = binaryLevelId.replace(/l/g, '100')
        binaryLevelId = binaryLevelId.replace(/r/g, '101')
        binaryLevelId = binaryLevelId.replace(/a/g, '110')
        binaryLevelId = binaryLevelId.replace(/o/g, '111')
        binaryLevelId = binaryLevelId.replace(/R/g, '111')

        let levelIdLeft = binaryLevelId
        let levelId = ''
        let i = 0
        while (levelIdLeft.length > 0) {
            if (levelIdLeft.length <= 64){
                levelId += parseInt(levelIdLeft.substring(0, levelIdLeft.length), 2).toString(16)
                levelIdLeft = ''
            }                
            else {
                levelId += parseInt(levelIdLeft.substring(0, 64), 2).toString(16)
                levelIdLeft = levelIdLeft.substring(64)
            }
            i++
        }
        return levelId
    }
    getGridSpriteForCharacter(character) {
        switch (character) {
            case 'o':
            case 'R':
            case 'E':
                return 'circle'
            case '-':
                return 'horLine'
            case '|':
                return 'vertLine'
            case 'e':
                return 'exit'
        }
    }
    convertGridToPixels(gridX, gridY) {
        const offset = 90

        return {
            x: offset + gridX * this.gridRadius,
            y: offset + gridY * this.gridRadius
        }
    }
    convertPixelsToGrid(pixelX, pixelY) {
        const offset = 90

        return {
            x: Math.round((pixelX - offset) / this.gridRadius),
            y: Math.round((pixelY - offset) / this.gridRadius)
        }
    }
    getPositionOfElementInPixels(element) {
        const gridPosition = this.getPositionOfElementInGrid(element)
        const pixelPosition = gridGenerator.convertGridToPixels(gridPosition.x, gridPosition.y)

        return pixelPosition
    }
    getPositionOfElementInGrid(element) {
        const xPos = gridGenerator.levelGrid.findIndex(innerArray => innerArray.includes(element))
        const yPos = gridGenerator.levelGrid[xPos].findIndex(el => el === element)
        return { x: xPos, y: yPos }
    }
    getLevelString() {
        const level = 'R-o   o-o-o-o-e\n\
  |   | | | |  \n\
o-o o-o o-o o  \n\
|   |   | | |  \n\
o-o-o   E-o o  \n\
  |     a   |  \n\
  o-or     lo  '
        return level
    }
}

var gridGenerator = new GridGenerator()

