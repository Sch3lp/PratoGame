class RandomGridGenerator {
    generate() {
        var blockNames = []
        const startBlockName = this.getBlockNameWithStartCircleOn('1')
        blockNames.push(startBlockName)
        var nextBlockName = startBlockName

        for (let i = 0; i < 3; i++) {
            var nextStartPosition = this.getValidRandomStartAfterBlock(nextBlockName)
            nextBlockName = this.getBlockNameWithStartCircleOn(nextStartPosition)
            blockNames.push(nextBlockName)
        }

        var blockStrings = blockNames.map(this.getRandomBlockStringByName)
        this.setRobbyEnemyAndExitInTheGrid(blockStrings)
        var grid = this.joinBlockStrings(blockStrings)
        grid = this.setPartInGrid(grid, 'l')
        grid = this.setPartInGrid(grid, 'r')
        grid = this.setPartInGrid(grid, 'a')
        return grid
    }
    getBlockNameWithStartCircleOn(lineHeight) {
        return this.getBlockNameWithCircleOn(true, lineHeight)
    }
    getBlockNameWithEndCircleOn(lineHeight) {
        return this.getBlockNameWithCircleOn(false, lineHeight)
    }
    getBlockNameWithCircleOn(start, lineHeight) {
        const blocks = Object.getOwnPropertyNames(LevelBlocks).filter(x => x.startsWith('block'))
        const validBlocks = blocks.filter(x => x.substring(5).split('x')[start ? 0 : 1].split('').includes(lineHeight))
        return validBlocks[Math.floor(Math.random() * validBlocks.length)]
    }
    getValidRandomStartAfterBlock(blockName) {
        const possibilities = blockName.substring(5).split('x')[1].split('')
        return possibilities[Math.floor(Math.random() * possibilities.length)];
    }
    getRandomBlockStringByName(blockName) {
        const blockStrings = LevelBlocks[blockName]()
        return blockStrings[Math.floor(Math.random() * blockStrings.length)]
    }
    setRobbyEnemyAndExitInTheGrid(blockStrings) {
        var getRandomCircleIndexInBlock = (block) => {
            var indices = [];
            for (var i = 0; i < block.length; i++) {
                if (block[i] === "o") indices.push(i);
            }
            return indices[Math.floor(Math.random() * indices.length)]
        }
        blockStrings[0] = blockStrings[0].replace("o", "R")
        const randomExitIndex = getRandomCircleIndexInBlock(blockStrings[3])
        blockStrings[3] = blockStrings[3].substr(0, randomExitIndex) + "e" + blockStrings[3].substr(randomExitIndex + 1)
        const randomEnemyIndex = getRandomCircleIndexInBlock(blockStrings[2])
        blockStrings[2] = blockStrings[2].substr(0, randomEnemyIndex) + "E" + blockStrings[2].substr(randomEnemyIndex + 1)
    }
    joinBlockStrings(blockStrings) {
        var levelGridPerLine = []
        const lines = blockStrings[0].split('\n').length
        for (let i = 0; i < lines; i++) {
            for (let j = 0; j < blockStrings.length; j++) {
                if (j === 0) {
                    levelGridPerLine[i] = blockStrings[j].split('\n')[i]
                    continue
                }
                const previousPart = blockStrings[j - 1].split('\n')[i]
                const firstOfCurrent = blockStrings[j].split('\n')[i].substring(0, 1)
                const lastOfPrevious = previousPart.substring(previousPart.length - 1)
                const joiner = ["E", "o", "e"].includes(firstOfCurrent) && ["E", "o", "e"].includes(lastOfPrevious)
                levelGridPerLine[i] += (joiner ? "-" : " ") + blockStrings[j].split('\n')[i]
            }
        }
        return levelGridPerLine.join('\n')
    }
    setPartInGrid(grid, part) {
        const randomLeftPossibilityIndex = this.getRandomStringIndexInGrid(grid, " o")
        if (randomLeftPossibilityIndex) {
            grid = grid.substr(0, randomLeftPossibilityIndex) + part + "o" + grid.substr(randomLeftPossibilityIndex + 2)
        } else {
            const randomRightPossibilityIndex = this.getRandomStringIndexInGrid(grid, "o ")
            if (randomRightPossibilityIndex) {
                grid = grid.substr(0, randomRightPossibilityIndex) + "o" + part + grid.substr(randomRightPossibilityIndex + 2)
            } else {
                grid = this.setPartInTransposedGrid(grid, part)
            }
        }
        return grid
    }
    setPartInTransposedGrid(grid, part) {
        var transposedGrid = this.transposeGrid(grid)
        const randomLeftPossibilityIndex = this.getRandomStringIndexInGrid(transposedGrid, " o")
        if (randomLeftPossibilityIndex) {
            transposedGrid = transposedGrid.substr(0, randomLeftPossibilityIndex) + part + "o" + transposedGrid.substr(randomLeftPossibilityIndex + 2)
        } else {
            const randomRightPossibilityIndex = this.getRandomStringIndexInGrid(transposedGrid, "o ")
            if (randomRightPossibilityIndex) {
                transposedGrid = transposedGrid.substr(0, randomRightPossibilityIndex) + "o" + part + transposedGrid.substr(randomRightPossibilityIndex + 2)
            }
        }
        return this.transposeGrid(transposedGrid)
    }
    getRandomStringIndexInGrid(grid, string) {
        var indices = [];
        for (var i = 2; i < grid.length - 2; i++) {
            if (grid.substring(i, i + 2) === string) indices.push(i);
        }
        return indices[Math.floor(Math.random() * indices.length)]
    }

    transposeGrid(grid, part) {
        var gridArrayArray = grid.split('\n').map(x => x.split(''))
        var transposedGrid = ''

        for (let i = 0; i < gridArrayArray[0].length; i++) {
            for (let j = 0; j < gridArrayArray.length; j++) {
                transposedGrid += gridArrayArray[j][i]
            }
            if(i !== gridArrayArray[0].length - 1)transposedGrid += '\n'
        }
        return transposedGrid
    }
}