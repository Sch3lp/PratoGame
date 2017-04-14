var Robby = {
  windingKey : { windCalled: false},
  navigation : { setNavigationCalled: false, x: 0, y: 0}
};

Robby.go = function(){
  if(!this.windingKey.windCalled) return 'Robby cannot go without winding the windingKey!'
  if(!this.navigation.setNavigationCalled) return 'Robby cannot go without setting the navigation!'
  return 'GOING'
}

Robby.goRight = function(){
  this.windingKey.wind();
  this.navigation.setNavigation(1, 0);
  return this.go();
}

Robby.windingKey.wind = function(){
  this.windCalled = true
  return 'Succes!'
}

Robby.navigation.setNavigation = function(x, y){
  this.setNavigationCalled = true
  this.x = x
  this.y = y
  return 'Succes!'
}

help = () => 'No cheating!'
