function Enemy() {
    this.game;
    this.sprite;
    this.emitter;
    this.goingDown;
};

var enemy = new Enemy();

Enemy.prototype.init = function (game) {
    this.game = game;
    const rows = gridGenerator.levelGrid.length;
    const columns = gridGenerator.levelGrid[0].length;
    const offset = 50;
    const xPos = gridGenerator.levelGrid.findIndex(innerArray => innerArray.includes('E'));
    const yPos = gridGenerator.levelGrid[xPos].findIndex(element => element === 'E');
    var enemyPixelPosition = gridGenerator.convertGridToPixels(xPos, yPos);

    this.emitter = game.add.emitter(enemyPixelPosition.x, enemyPixelPosition.y, 100);
    this.emitter.makeParticles('dustRed');
    this.emitter.setAlpha(1, 0, 500);
    this.emitter.setScale(0, 0.25, 0, 0.25, 500, Phaser.Easing.Quintic.Out);
    this.emitter.maxParticleSpeed = new Phaser.Point(50, 50);
    this.emitter.minParticleSpeed = new Phaser.Point(-50, -50);
    game.time.events.add(10 * columns * rows + 500, () => { this.emitter.start(false, 500, 10); }, this);

    this.sprite = game.addTweenedSprite('badrobot', enemyPixelPosition.x, enemyPixelPosition.y, 10 * columns * rows, 0.5);
	var anim = this.sprite.animations.add('blink');
	anim.play(5, true);
}

Enemy.prototype.canYouGoThere = function (diffX, diffY) {
  const position = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y);
  return gridGenerator.levelGrid[position.x + diffX]
    && gridGenerator.levelGrid[position.x + diffX][position.y + diffY]
    && ['-', '|'].includes(gridGenerator.levelGrid[position.x + diffX][position.y + diffY]);
}

Enemy.prototype.go = function (x, y) {
  const enemyPosition = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y);
  const destination = gridGenerator.convertGridToPixels(enemyPosition.x + x * 2, enemyPosition.y + y * 2);

  this.game.add.tween(this.sprite).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true);
  this.game.add.tween(this.emitter).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true);
  this.game.add.tween(this.sprite.scale).to({ x: this.sprite.scale.x * 0.8, y: this.sprite.scale.y * 0.8 }, 125, Phaser.Easing.Linear.InOut, true).yoyo(true);
}

Enemy.prototype.notify = function (game) {
    if(this.goingDown){
        if(this.canYouGoThere(0, -1)){
            this.go(0, -1)
        } else {
            this.goingDown = false;
            this.go(0, 1)
        }

    } else {
        if(this.canYouGoThere(0, 1)){
            this.go(0, 1)
        } else {
            this.goingDown = true;
            this.go(0, -1)
        }
    }
}