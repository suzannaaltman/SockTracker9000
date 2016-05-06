var router = require('express').Router();
var pg = require('pg');
var path = require('path');
var connectionString = require('../db/connection').connectionString;

var userId = '';

router.get('/*', function(request, response, next){
  if(request.isAuthenticated()){
    userId = request.user.id;
    // console.log(userId);
    next();
  } else {
    response.send('404 not found');
  }
})

router.get('/', function(request, response){
  response.sendFile(path.join(__dirname, '../public/views/index.html'));
})

router.get('/list', function(request, response){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
      response.sendStatus(500);
    }else{
      var query = client.query('SELECT * FROM socklist WHERE user_id = '+ userId + ';');
      var results = [];

      query.on('row', function(row){
        results.push(row);
      });

      query.on('end', function(){
        done();
        response.send(results);
      });

      query.on('error', function(error){
        console.log('Error running query:', error);
        done();
        response.sendStatus(500);
      });
    }
  })
});

router.get('/*', function(request, response, next){
  response.redirect('/socks');
})

module.exports = router;
