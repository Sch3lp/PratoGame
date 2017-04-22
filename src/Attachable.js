function Attachable(element) {
    this.isAttachable = true;
    this.magnet = new Magnet();
    this.element = element;
    this.sprite;
};

leftArm = new Attachable('l');
rightArm = new Attachable('r');
antenna = new Attachable('a');

function Magnet() {
    this.isActive = false;
};

Attachable.prototype.init = function(game){    
    const position = gridGenerator.getPositionOfElementInPixels(this.element);
    this.sprite = game.addTweenedSprite(this.element, position.x, position.y, 0, 1);
}

Magnet.prototype.activate = function(){
    this.isActive = true;
    return 'Magnet activated!';
}