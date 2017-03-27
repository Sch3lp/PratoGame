var Robby = {
  windingKey : { windCalled: false},
  navigation : { setNavigationCalled: false}
};

Robby.go = function(){
  if(!this.windingKey.windCalled) return 'Robby cannot go without winding the windingKey!'
  if(!this.navigation.setNavigationCalled) return 'Robby cannot go without setting the navigation!'
  return 'GOING'
}

Robby.windingKey.wind = function(){
  this.windCalled = true
  return 'Succes!'
}

Robby.navigation.setNavigation = function(){
  this.setNavigationCalled = true
  return 'Succes!'
}
