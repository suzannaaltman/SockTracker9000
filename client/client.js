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
      console.log('socklist:', drawer.socklist);
      if(drawer.socklist.length > 0){
        drawer.message = 'Welcome to the Sock Drawer!'
      }else{
        drawer.message = 'Welcome to Uncle Morty\'s SockTracker 9000! Time to add some socks!';
      }

    });
  }

  drawer.setRetire = function(sock) {
    console.log('Sock to retire is:', sock);
    sockId = sock.id;
    $http.put('/socks/retire/', sock).then(function(response){
      console.log('retired sock response:', response);
    })
    drawer.getSocks();
  };

  drawer.setWorn = function(sock) {
    console.log('Sock worn is:', sock);
    sockId = sock.id;
    $http.put('/socks/worn/', sock).then(function(response){
      console.log('worn sock response:', response);
    })
    drawer.getSocks();
  };

  drawer.getSocks();
}]);

app.controller('AddController' ,function(){
  this.message = 'Welcome to the add sock page!'
});

app.controller('StatsController' , ['$http', function($http){
  var stats = this;
  stats.socks = [];
  stats.retiredSocks = [];
  stats.availSocks = [];

  stats.getSocks = function(){
    $http.get('/socks/statsList')
    .then(function(response) {
      stats.socks = response.data;
      stats.brand = '';
      stats.style = '';
      stats.description = '';
      stats.purchase_price = 0;
      stats.purchase_date = '';
      stats.times_worn = 0;
      stats.retired = '';
      for(var i = 0; i < stats.socks.length; i++){
        if(stats.socks[i].retired === true){
          stats.retiredSocks.push(stats.socks[i]);
        }else{
          stats.availSocks.push(stats.socks[i]);
        }

      }
      console.log('retiredSocks:', stats.retiredSocks);
      console.log('availableSocks:', stats.availSocks)
    });
  }
  stats.getSocks();
}]);

app.controller('AboutController', function(){
  this.message = 'This project is an interactive application which draws upon Uncle Morty’s analog sock-tracking system (a file of flat scanned socks, sock packages and receipts - printed and stored in a sock drawer) and moves the process into the 21st century. Suzanna Altman fully acknowledges that Uncle Morty’s original process has generally been considered to be a silly endeavor that wastes time and provides unimportant (though useable) data for future sock purchasing. The creation of Uncle Morty’s SockTracker 9000 upgrades the system, but continues in the tradition of being silly, time-wasting and unimportant. Only Uncle Morty’s fellow engineers may appreciate the outcome.' +
  ' Suzanna believes this project will utilize the SEAN stack well also plans to style the application to look like a program MS-DOS-like program as a throwback to the analog origins of the project. Altman also believes the project will be memorable to interviewers and will be a fun gift to give to Uncle Morty himself.'

});
