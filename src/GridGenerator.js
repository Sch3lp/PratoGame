function GridGenerator() {
    this.getLevelString = () => {
        var level = "R-oa  o-o-o\n\
  |   | | |\n\
o-o o-o o-o\n\
|   |   | |\n\
o-o-o   E-o\n\
  |       c\n\
  o-ob     ";
        return level;
    };
    this.createGrid = () => {
        var level = this.getLevelString();
        var oneLineLevel = level.replace(/(\r\n|\n|\r)/gm, "");
        const offset = 50;
        const columns = Math.max(...level.split('\n').map((line) => line.length));
        const rows = level.split('\n').length;

        var grid = [];

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (!grid[j]) grid[j] = [];
                grid[j][i] = oneLineLevel[i * columns + j];
            }
        }
        return grid;
    };
    this.levelGrid = this.createGrid();
    this.gridRadius;
    this.game;
}

var gridGenerator = new GridGenerator();

GridGenerator.prototype.setupGrid = function (game) {
    this.game = game;
    const rows = this.levelGrid[0].length;
    const columns = this.levelGrid.length;
    this.gridRadius = this.calculateGridRadius(game, rows, columns)
    const offset = 50;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var spriteName = this.getGridSpriteForCharacter(this.levelGrid[j][i]);
            game.addTweenedSprite(spriteName, offset + j * this.gridRadius, offset + i * this.gridRadius, 10 * i * columns + j, 1);
        }
    }
};

GridGenerator.prototype.calculateGridRadius = function (game, rows, columns) {    
    const columnWidth = (game.world.width - 200) / columns;
    const rowHeight = (game.world.height - 400) / rows;
    return Math.min(columnWidth, rowHeight);
};
GridGenerator.prototype.getGridSpriteForCharacter = (character) => {
    switch (character) {
        case 'o':
        case 'R':
        case 'E':
            return 'circle';
        case '-':
            return 'horLine';
        case '|':
            return 'vertLine';
    }
};
GridGenerator.prototype.convertGridToPixels = function(gridX, gridY) {
  const rows = gridGenerator.levelGrid[0].length;
  const columns = gridGenerator.levelGrid.length;
  const offset = 50;

  return {
      x: offset + gridX * this.gridRadius,
      y: offset + gridY * this.gridRadius
  };
};
GridGenerator.prototype.convertPixelsToGrid = function(pixelX, pixelY) {
  const rows = gridGenerator.levelGrid[0].length;
  const columns = gridGenerator.levelGrid.length;
  const offset = 50;

  return {
      x: Math.round((pixelX - offset) / this.gridRadius),
      y: Math.round((pixelY - offset) / this.gridRadius)
  };
};

