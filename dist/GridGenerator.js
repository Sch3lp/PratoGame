'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GridGenerator = function () {
    function GridGenerator() {
        _classCallCheck(this, GridGenerator);

        this.levelGrid;
        this.gridRadius;
        this.game;
        this.levelString;
    }

    _createClass(GridGenerator, [{
        key: 'createGrid',
        value: function createGrid() {
            this.levelString = !this.game.isNotFirstRun ? this.getLevelString() : new RandomGridGenerator().generate();
            var oneLineLevel = this.levelString.replace(/(\r\n|\n|\r)/gm, '');
            var columns = Math.max.apply(Math, _toConsumableArray(this.levelString.split('\n').map(function (line) {
                return line.length;
            })));
            var rows = this.levelString.split('\n').length;

            var grid = [];

            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    if (!grid[j]) grid[j] = [];
                    grid[j][i] = oneLineLevel[i * columns + j];
                }
            }
            return grid;
        }
    }, {
        key: 'setupGrid',
        value: function setupGrid(game) {
            this.game = game;
            this.levelGrid = this.createGrid();
            var rows = this.levelGrid[0].length;
            var columns = this.levelGrid.length;
            this.gridRadius = this.calculateGridRadius(game, rows, columns);
            var offset = 90;

            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    if ([' ', 'r', 'l', 'a'].indexOf(this.levelGrid[j][i]) !== -1) continue;
                    var spriteName = this.getGridSpriteForCharacter(this.levelGrid[j][i]);
                    if (['horLine', 'vertLine'].indexOf(spriteName) !== -1) {
                        game.addTweenedGridLine(spriteName, offset + j * this.gridRadius, offset + i * this.gridRadius);
                    } else {
                        game.addTweenedSprite(spriteName, offset + j * this.gridRadius, offset + i * this.gridRadius, 750, 1);
                    }
                }
            }
        }
    }, {
        key: 'calculateGridRadius',
        value: function calculateGridRadius(game, rows, columns) {
            var columnWidth = (game.world.width - 200) / columns;
            var rowHeight = (game.world.height - 425) / rows;
            return Math.min(columnWidth, rowHeight);
        }
    }, {
        key: 'getGridSpriteForCharacter',
        value: function getGridSpriteForCharacter(character) {
            switch (character) {
                case 'o':
                case 'R':
                case 'E':
                    return 'circle';
                case '-':
                    return 'horLine';
                case '|':
                    return 'vertLine';
                case 'e':
                    return 'exit';
            }
        }
    }, {
        key: 'convertGridToPixels',
        value: function convertGridToPixels(gridX, gridY) {
            var offset = 90;

            return {
                x: offset + gridX * this.gridRadius,
                y: offset + gridY * this.gridRadius
            };
        }
    }, {
        key: 'convertPixelsToGrid',
        value: function convertPixelsToGrid(pixelX, pixelY) {
            var offset = 90;

            return {
                x: Math.round((pixelX - offset) / this.gridRadius),
                y: Math.round((pixelY - offset) / this.gridRadius)
            };
        }
    }, {
        key: 'getPositionOfElementInPixels',
        value: function getPositionOfElementInPixels(element) {
            var gridPosition = this.getPositionOfElementInGrid(element);
            var pixelPosition = gridGenerator.convertGridToPixels(gridPosition.x, gridPosition.y);

            return pixelPosition;
        }
    }, {
        key: 'getPositionOfElementInGrid',
        value: function getPositionOfElementInGrid(element) {
            var xPos = gridGenerator.levelGrid.findIndex(function (innerArray) {
                return innerArray.indexOf(element) !== -1;
            });
            var yPos = gridGenerator.levelGrid[xPos].findIndex(function (el) {
                return el === element;
            });
            return { x: xPos, y: yPos };
        }
    }, {
        key: 'getLevelString',
        value: function getLevelString() {
            var level = 'R-o   o-o-o-o-e\n\
  |   | | | |  \n\
o-o o-o o-o o  \n\
|   |   | | |  \n\
o-o-o   E-o o  \n\
  |     a   |  \n\
  o-or     lo  ';
            return level;
        }
    }]);

    return GridGenerator;
}();

var gridGenerator = new GridGenerator();