'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RandomGridGenerator = function () {
    function RandomGridGenerator() {
        _classCallCheck(this, RandomGridGenerator);
    }

    _createClass(RandomGridGenerator, [{
        key: 'generate',
        value: function generate() {
            var blockNames = [];
            var startBlockName = this.getBlockNameWithStartCircleOn('1');
            blockNames.push(startBlockName);
            var nextBlockName = startBlockName;

            for (var i = 0; i < 3; i++) {
                var nextStartPosition = this.getValidRandomStartAfterBlock(nextBlockName);
                nextBlockName = this.getBlockNameWithStartCircleOn(nextStartPosition);
                blockNames.push(nextBlockName);
            }

            var blockStrings = blockNames.map(this.getRandomBlockStringByName);
            this.setRobbyEnemyAndExitInTheGrid(blockStrings);
            var grid = this.joinBlockStrings(blockStrings);
            grid = this.setPartInGrid(grid, 'l');
            grid = this.setPartInGrid(grid, 'r');
            grid = this.setPartInGrid(grid, 'a');
            return grid;
        }
    }, {
        key: 'getBlockNameWithStartCircleOn',
        value: function getBlockNameWithStartCircleOn(lineHeight) {
            return this.getBlockNameWithCircleOn(true, lineHeight);
        }
    }, {
        key: 'getBlockNameWithEndCircleOn',
        value: function getBlockNameWithEndCircleOn(lineHeight) {
            return this.getBlockNameWithCircleOn(false, lineHeight);
        }
    }, {
        key: 'getBlockNameWithCircleOn',
        value: function getBlockNameWithCircleOn(start, lineHeight) {
            var blocks = Object.getOwnPropertyNames(LevelBlocks).filter(function (x) {
                return x.startsWith('block');
            });
            var validBlocks = blocks.filter(function (x) {
                return x.substring(5).split('x')[start ? 0 : 1].split('').indexOf(lineHeight) !== -1;
            });
            return validBlocks[Math.floor(Math.random() * validBlocks.length)];
        }
    }, {
        key: 'getValidRandomStartAfterBlock',
        value: function getValidRandomStartAfterBlock(blockName) {
            var possibilities = blockName.substring(5).split('x')[1].split('');
            return possibilities[Math.floor(Math.random() * possibilities.length)];
        }
    }, {
        key: 'getRandomBlockStringByName',
        value: function getRandomBlockStringByName(blockName) {
            var blockStrings = LevelBlocks[blockName]();
            return blockStrings[Math.floor(Math.random() * blockStrings.length)];
        }
    }, {
        key: 'setRobbyEnemyAndExitInTheGrid',
        value: function setRobbyEnemyAndExitInTheGrid(blockStrings) {
            var getRandomCircleIndexInBlock = function getRandomCircleIndexInBlock(block) {
                var indices = [];
                for (var i = 0; i < block.length; i++) {
                    if (block[i] === "o") indices.push(i);
                }
                return indices[Math.floor(Math.random() * indices.length)];
            };
            blockStrings[0] = blockStrings[0].replace("o", "R");
            var randomExitIndex = getRandomCircleIndexInBlock(blockStrings[3]);
            blockStrings[3] = blockStrings[3].substr(0, randomExitIndex) + "e" + blockStrings[3].substr(randomExitIndex + 1);
            var randomEnemyIndex = getRandomCircleIndexInBlock(blockStrings[2]);
            blockStrings[2] = blockStrings[2].substr(0, randomEnemyIndex) + "E" + blockStrings[2].substr(randomEnemyIndex + 1);
        }
    }, {
        key: 'joinBlockStrings',
        value: function joinBlockStrings(blockStrings) {
            var levelGridPerLine = [];
            var lines = blockStrings[0].split('\n').length;
            for (var i = 0; i < lines; i++) {
                for (var j = 0; j < blockStrings.length; j++) {
                    if (j === 0) {
                        levelGridPerLine[i] = blockStrings[j].split('\n')[i];
                        continue;
                    }
                    var previousPart = blockStrings[j - 1].split('\n')[i];
                    var firstOfCurrent = blockStrings[j].split('\n')[i].substring(0, 1);
                    var lastOfPrevious = previousPart.substring(previousPart.length - 1);
                    var joiner = ["E", "o", "e"].indexOf(firstOfCurrent) !== -1 && ["E", "o", "e"].indexOf(lastOfPrevious) !== -1;
                    levelGridPerLine[i] += (joiner ? "-" : " ") + blockStrings[j].split('\n')[i];
                }
            }
            return levelGridPerLine.join('\n');
        }
    }, {
        key: 'setPartInGrid',
        value: function setPartInGrid(grid, part) {
            var randomLeftPossibilityIndex = this.getRandomStringIndexInGrid(grid, " o");
            if (randomLeftPossibilityIndex) {
                grid = grid.substr(0, randomLeftPossibilityIndex) + part + "o" + grid.substr(randomLeftPossibilityIndex + 2);
            } else {
                var randomRightPossibilityIndex = this.getRandomStringIndexInGrid(grid, "o ");
                if (randomRightPossibilityIndex) {
                    grid = grid.substr(0, randomRightPossibilityIndex) + "o" + part + grid.substr(randomRightPossibilityIndex + 2);
                } else {
                    grid = this.setPartInTransposedGrid(grid, part);
                }
            }
            return grid;
        }
    }, {
        key: 'setPartInTransposedGrid',
        value: function setPartInTransposedGrid(grid, part) {
            var transposedGrid = this.transposeGrid(grid);
            var randomLeftPossibilityIndex = this.getRandomStringIndexInGrid(transposedGrid, " o");
            if (randomLeftPossibilityIndex) {
                transposedGrid = transposedGrid.substr(0, randomLeftPossibilityIndex) + part + "o" + transposedGrid.substr(randomLeftPossibilityIndex + 2);
            } else {
                var randomRightPossibilityIndex = this.getRandomStringIndexInGrid(transposedGrid, "o ");
                if (randomRightPossibilityIndex) {
                    transposedGrid = transposedGrid.substr(0, randomRightPossibilityIndex) + "o" + part + transposedGrid.substr(randomRightPossibilityIndex + 2);
                }
            }
            return this.transposeGrid(transposedGrid);
        }
    }, {
        key: 'getRandomStringIndexInGrid',
        value: function getRandomStringIndexInGrid(grid, string) {
            var indices = [];
            for (var i = 2; i < grid.length - 2; i++) {
                if (grid.substring(i, i + 2) === string) indices.push(i);
            }
            return indices[Math.floor(Math.random() * indices.length)];
        }
    }, {
        key: 'transposeGrid',
        value: function transposeGrid(grid, part) {
            var gridArrayArray = grid.split('\n').map(function (x) {
                return x.split('');
            });
            var transposedGrid = '';

            for (var i = 0; i < gridArrayArray[0].length; i++) {
                for (var j = 0; j < gridArrayArray.length; j++) {
                    transposedGrid += gridArrayArray[j][i];
                }
                if (i !== gridArrayArray[0].length - 1) transposedGrid += '\n';
            }
            return transposedGrid;
        }
    }]);

    return RandomGridGenerator;
}();