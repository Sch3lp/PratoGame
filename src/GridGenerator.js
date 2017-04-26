class GridGenerator {
    constructor() {
        this.levelGrid = this.createGrid()
        this.gridRadius
        this.game
    }
    createGrid() {
        const level = this.getLevelString()
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
        const rows = this.levelGrid[0].length
        const columns = this.levelGrid.length
        this.gridRadius = this.calculateGridRadius(game, rows, columns)
        const offset = 70

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const spriteName = this.getGridSpriteForCharacter(this.levelGrid[j][i])
                game.addTweenedSprite(spriteName, offset + j * this.gridRadius, offset + i * this.gridRadius, 10 * i * columns + j, 1)
            }
        }
    }
    calculateGridRadius(game, rows, columns) {
        const columnWidth = (game.world.width) / columns
        const rowHeight = (game.world.height - 360) / rows
        return Math.min(columnWidth, rowHeight)
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
        const offset = 70

        return {
            x: offset + gridX * this.gridRadius,
            y: offset + gridY * this.gridRadius
        }
    }
    convertPixelsToGrid(pixelX, pixelY) {
        const offset = 70

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
  o-ol     ro  '
        return level
    }
}

var gridGenerator = new GridGenerator()

