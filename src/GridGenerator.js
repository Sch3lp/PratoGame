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
                if (!grid[i]) grid[i] = [];
                grid[i][j] = oneLineLevel[i * columns + j];
            }
        }
        return grid;
    };
    this.levelGrid = this.createGrid();
}

var gridGenerator = new GridGenerator();

GridGenerator.prototype.setupGrid = function(game) {
    const rows = this.levelGrid.length;
    const columns = this.levelGrid[0].length;
    const offset = 50;
    const columnWidth = (game.world.width - 200) / columns;
    const rowHeight = (game.world.height - 400) / rows;
    const finalRadius = Math.min(columnWidth, rowHeight);

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var spriteName = this.getGridSpriteForCharacter(this.levelGrid[i][j]);
            game.addTweenedSprite(spriteName, offset + j * finalRadius, offset + i * finalRadius, 10 * i * columns + j, 1);
        }
    }
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