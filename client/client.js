var app = angular.module('sockApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
    .when('/socks', {
      templateUrl: 'views/drawer.html',
      controller: 'DrawerController',
      controllerAs: 'drawer'
    })
    .when('/socks/add', {
      templateUrl: 'views/add.html',
      controller: 'AddController',
      controllerAs: 'add'
    })
    .when('/socks/stats', {
      templateUrl: 'views/stats.html',
      controller: 'StatsController',
      controllerAs: 'stats'
    })
    .when('/socks/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutController',
      controllerAs: 'about'
    })

  $locationProvider.html5Mode(true);

}])

app.controller('DrawerController' , ['$http', function($http){
  var drawer = this;
  drawer.message = '';
  drawer.socklist = [];

  drawer.getSocks = function(){
    $http.get('/socks/list')
    .then(function(response) {
      drawer.socklist = response.data;
      drawer.brand = '';
      drawer.style = '';
      drawer.description = '';
      drawer.id = 0;
      // console.log('socklist:', drawer.socklist);
    });
  }
  if(drawer.socklist.length > 0){
    drawer.message = 'Welcome to the Sock Drawer!'
  }else{
    drawer.message = 'Welcome to Uncle Morty\'s SockTracker 9000! Time to add some socks!';
  }

  drawer.getSocks();
}]);

app.controller('AddController' ,function(){
  this.message = 'Welcome to the add sock page!'
});

app.controller('StatsController' ,function(){
  this.message = 'Welcome to the stats page!'
});

app.controller('AboutController', function(){
  this.message = 'This project is an interactive application which draws upon Uncle Morty’s analog sock-tracking system (a file of flat scanned socks, sock packages and receipts - printed and stored in a sock drawer) and moves the process into the 21st century. Suzanna Altman fully acknowledges that Uncle Morty’s original process has generally been considered to be a silly endeavor that wastes time and provides unimportant (though useable) data for future sock purchasing. The creation of Uncle Morty’s SockTracker 9000 upgrades the system, but continues in the tradition of being silly, time-wasting and unimportant. Only Uncle Morty’s fellow engineers may appreciate the outcome.' +
  ' Suzanna believes this project will utilize the SEAN stack well also plans to style the application to look like a program MS-DOS-like program as a throwback to the analog origins of the project. Altman also believes the project will be memorable to interviewers and will be a fun gift to give to Uncle Morty himself.'

});
