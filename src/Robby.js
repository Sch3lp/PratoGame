function Robby() {
  this.windingKey = new WindingKey();
  this.navigation = new Navigation();
  this.game;
  this.sprite;
  this.emitter;
  this.leftEye;
  this.rightEye;
};

function WindingKey() {
  this.windCalled = false;
  this.wind = () => {
    this.windCalled = true;
  }
}

function Navigation() {
  this.x = 0;
  this.y = 0;
  this.setNavigationCalled = false;
  this.setNavigation = (x, y) => {
    this.setNavigationCalled = true;
    this.x = x;
    this.y = y;
  }
}

var robby = new Robby();

Robby.prototype.go = function () {
  if (!this.windingKey.windCalled) return 'Robby cannot go without winding the windingKey!'
  if (!this.navigation.setNavigationCalled) return 'Robby cannot go without setting the navigation!'
  if (!this.canYouGoThere(this.navigation.x, this.navigation.y)) return 'I cannot go there!'
  this.windingKey.windCalled = false;
  this.navigation.setNavigationCalled = false;
  const robbyPosition = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y);
  const destination = gridGenerator.convertGridToPixels(robbyPosition.x + this.navigation.x * 2, robbyPosition.y + this.navigation.y * 2);

  this.game.add.tween(this.sprite).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true);
  this.game.add.tween(this.emitter).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true);
  this.game.add.tween(this.sprite.scale).to({ x: this.sprite.scale.x * 0.8, y: this.sprite.scale.y * 0.8 }, 125, Phaser.Easing.Linear.InOut, true).yoyo(true);
  this.game.time.events.add(250, () => enemy.notify(), this);
  
}

Robby.prototype.init = function (game) {
  this.game = game;
  const position = gridGenerator.getPositionOfElementInPixels('R');

  this.emitter = game.add.emitter(position.x, position.y, 100);
  this.emitter.makeParticles('dust');
  this.emitter.setAlpha(1, 0, 500);
  this.emitter.setScale(0, 0.25, 0, 0.25, 500, Phaser.Easing.Quintic.Out);
  this.emitter.maxParticleSpeed = new Phaser.Point(50, 50);
  this.emitter.minParticleSpeed = new Phaser.Point(-50, -50);
  game.time.events.add(500, () => { this.emitter.start(false, 500, 10); }, this);

  this.sprite = game.addTweenedSprite('robby', position.x, position.y, 0, 0.2);
  this.leftEye = game.addTweenedSprite('robbyeyeleft', -80, -135, 0, 1);
  this.rightEye = game.addTweenedSprite('robbyeyeright', 75, -135, 0, 1);
  this.leftEye.anchor.setTo(0.1, 0.5);
  this.rightEye.anchor.setTo(0.1, 0.5);
  this.sprite.addChild(this.leftEye);
  this.sprite.addChild(this.rightEye);
}

Robby.prototype.goRight = function () {
  this.windingKey.wind();
  this.navigation.setNavigation(1, 0);
  const problem = this.go();
  if (problem) return problem;
  return 'GOING!';
}

Robby.prototype.canYouGoThere = function (diffX, diffY) {
  const position = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y);
  return gridGenerator.levelGrid[position.x + diffX]
    && gridGenerator.levelGrid[position.x + diffX][position.y + diffY]
    && ['-', '|'].includes(gridGenerator.levelGrid[position.x + diffX][position.y + diffY]);
}

Robby.prototype.doABarrelRoll = function () {
  this.game.add.tween(this.sprite).to( { angle: 359 }, 250, Phaser.Easing.Linear.None, true);
	this.game.time.events.add(260, () => {this.sprite.angle = 0}, this);
}

Robby.prototype.attach = function (part) {
  if(!part.isAttachable) return "Can only attach Attachables";
  const myPosition = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y);
  const partPosition = gridGenerator.convertPixelsToGrid(part.sprite.x, part.sprite.y);
  const distance = Math.abs(myPosition.x - partPosition.x) + Math.abs(myPosition.y - partPosition.y)
  if(distance > 1) return "Can only attach adjacent Attachables";
  part.sprite.scale.setTo(1/this.sprite.scale.x, 1/this.sprite.scale.y);
  this.sprite.addChild(part.sprite);
  return "Attachment successful";
}

help = () => 'No cheating!'
console.log = (value) => value;

hack = () => {
  Robby.prototype.goUp = function () {
    this.windingKey.wind();
    this.navigation.setNavigation(0, -1);
    const problem = this.go();
    if (problem) return problem;
    return 'GOING!';
  }

  Robby.prototype.goLeft = function () {
    this.windingKey.wind();
    this.navigation.setNavigation(-1, 0);
    const problem = this.go();
    if (problem) return problem;
    return 'GOING!';
  }

  Robby.prototype.goDown = function () {
    this.windingKey.wind();
    this.navigation.setNavigation(0, 1);
    const problem = this.go();
    if (problem) return problem;
    return 'GOING!';
  }
  return 'Hack successful';
}
