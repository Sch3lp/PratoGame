function Robby() {
  this.windingKey = new WindingKey();
  this.navigation = new Navigation();
};

function WindingKey() {
  this.windCalled = false;
  this.wind = () => {
    this.windCalled = true
    return 'Succes!'
  }
}

function Navigation() {
  this.x = 0;
  this.y = 0;
  this.setNavigationCalled = false;
  this.setNavigation = (x, y) => {
    this.setNavigationCalled = true
    this.x = x
    this.y = y
    return 'Succes!'
  }
}

var robby = new Robby();

Robby.prototype.go = function () {
  if (!this.windingKey.windCalled) return 'Robby cannot go without winding the windingKey!'
  if (!this.navigation.setNavigationCalled) return 'Robby cannot go without setting the navigation!'
  return 'GOING'
}

Robby.prototype.goRight = function () {
  this.windingKey.wind();
  this.navigation.setNavigation(1, 0);
  return this.go();
}

help = () => 'No cheating!'
