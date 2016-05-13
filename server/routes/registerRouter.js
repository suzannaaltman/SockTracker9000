var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pg = require('pg');

var encryptLib = require('../../modules/encryption');
var connection = require('../db/connection').connectionString;


router.get('/', function(request, response, next){
  response.sendFile(path.resolve(__dirname, '../public/views/register.html'));
});


router.post('/', function(request, response, next){
  pg.connect(connection, function(err, client){
    var user = {
      email: request.body.email,
      password: encryptLib.encryptPassword(request.body.password)
    }
    // console.log('creating user:', user);

    var query = client.query('INSERT INTO userlist (email, password) VALUES ($1, $2)', [user.email, user.password]);

    query.on('error', function(err){
      console.log('error', err);
      response.redirect('/stinky');
    })

    query.on('end', function(){
      response.redirect('/');
      client.end();
    })
  })
});

module.exports = router;
