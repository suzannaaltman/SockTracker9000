var router = require('express').Router();
var pg = require('pg');
var path = require('path');
var connection = require('../db/connection').connectionString;

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
  pg.connect(connection, function(err, client, done){
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

router.post('/', function(request, response, next){
  pg.connect(connection, function(err, client){
    console.log('request.body:', request.body);

    var sock = {
      brand: request.body.brand,
      style: request.body.style,
      description: request.body.description,
      purchase_date: request.body.date,
      purchase_price: request.body.price
    }
    console.log('request.body.price', request.body.price);
    console.log('creating sock:', sock);
    console.log('userId:', userId);

    var query = client.query('INSERT INTO socklist (brand, style, description, purchase_date, purchase_price, user_id) VALUES ($1, $2, $3, $4, $5, $6)', [sock.brand, sock.style, sock.description, sock.purchase_date, sock.purchase_price, userId]);

    query.on('error', function(err){
      console.log('error', err);
    })

    query.on('end', function(){
      response.redirect('/socks');
      client.end();
    })
  })
});

router.get('/*', function(request, response, next){
  response.redirect('/socks');
})

module.exports = router;
