var app = angular.module('sockApp', ['ngRoute']);
//
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'views/front.html',
      controller: 'DrawerController',
      controllerAs: 'drawer'
    })
    .when('/add', {
      templateUrl: 'views/add.html',
      controller: 'AddController',
      controllerAs: 'add'
    })
    .when('/stats', {
      templateUrl: 'views/stats.html',
      controller: 'StatsController',
      controllerAs: 'stats'
    })

  $locationProvider.html5Mode(true);

}])

app.controller('DrawerController' ,function(){
  this.message = 'Welcome to the Sock Drawer!'
});
app.controller('AddController' ,function(){
  this.message = 'Welcome to the add sock page!'
});
app.controller('StatsController' ,function(){
  this.message = 'Welcome to the stats page!'
});
