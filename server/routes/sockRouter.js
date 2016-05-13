var router = require('express').Router();
var pg = require('pg');
var path = require('path');
var connection = require('../db/connection').connectionString;

var userId = '';

router.get('/*', function(request, response, next){
  console.log('authenitcate catch-all');
  if(request.isAuthenticated()){
    userId = request.user.id;
    console.log(userId);
    next();
  } else {
    response.redirect('/');
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
      var query = client.query('SELECT * FROM socklist WHERE retired = false AND user_id = '+ userId + ' ORDER BY brand;');
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

router.get('/statsList', function(request, response){
  pg.connect(connection, function(err, client, done){
    if(err){
      console.log(err);
      response.sendStatus(500);
    }else{
      var query = client.query('SELECT * FROM socklist WHERE user_id = '+ userId + 'ORDER BY brand;');
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

router.put('/retire', function(request, response, next){
  pg.connect(connection, function(err, client){
    console.log('Clicked RETIRE. Sock=', request.body);
    var sock = request.body;
    var sockId = request.body.id;

    var query = client.query('UPDATE socklist SET (retired, date_retired) = (true, now()) WHERE id = ($1)', [sockId]);

    query.on('error', function(err){
      console.log('error', err);
    })

    query.on('end', function(){
      console.log('Retired sock:', sock);
      response.sendStatus(200);
      client.end();
    })
  })
});

router.put('/worn', function(request, response, next){
  pg.connect(connection, function(err, client){
    console.log('Clicked worn. Sock=', request.body);
    var sock = request.body;
    var sockId = request.body.id;
    var timesWorn = request.body.times_worn;
    var purchase_price = request.body.purchase_price;

    timesWorn++;

    var price_per_wear = purchase_price / timesWorn;
    console.log('price_per_wear:', price_per_wear);

    var query = client.query('UPDATE socklist SET times_worn = ' + timesWorn + ', price_per_wear = ' + price_per_wear + 'WHERE id = ($1)', [sockId]);

    query.on('error', function(err){
      console.log('error', err);
    })

    query.on('end', function(){
      console.log('Wore sock:', sock);
      response.sendStatus(200);
      client.end();
    })
  })

});


router.get('/*', function(request, response, next){
  console.log('sock catch-all hit');
  response.redirect('/socks');
})

module.exports = router;
