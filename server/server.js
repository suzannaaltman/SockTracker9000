//NPM requirements
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var pg = require('pg');
var localStrategy = require('passport-local').Strategy;

//local
var index = require('./routes/indexRouter');
var connection = require('./db/connection');
// var registerRouter = require('.routes/registerRouter'); //these go through the indexRouter
// var sockRouter = require('./routes/sockRouter');
var encryptLib = require('../modules/encryption');

var app = express();
var port = process.env.PORT || 3000;

connection.initializeDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('server/public'));

//express-session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 60000, secure: false}
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//passport
passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'email'
},
  function(request, email, password, done){
    console.log('called local');
    pg.connect(connection.connectionString, function (err, client){
      console.log('called local-pg');

      var user = {};

      var query = client.query("SELECT * FROM userlist WHERE email = $1", [email]);

      query.on('row', function(row){
        console.log('User obj:', row);
        console.log('Password:', password);
        user = row;
        if(encryptLib.comparePassword(password, user.password)){
          console.log('Email and password matched');
          done(null, user);
        }else{
          console.log('Email and password NOT matched');
          done(null, false);
        }
      });

    //after data is returned, close connection
    query.on('end', function() {
      client.end();
    });

    //handle errors
    if(err){
      console.log(err);
    }
  });
}));

//authenticate users
passport.serializeUser(function(user, done){
  console.log('Hit serializeUser');
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log('called deserializeUser');
  pg.connect(connection.connectionString, function(err, client){
    var user = {};
    console.log('called deserializeUser - pg');
    var query = client.query("SELECT * FROM userlist WHERE id = $1", [id]);

    query.on('row', function(row){
      console.log('User row', row);
      user = row;
      done(null, user);
    });

    //after all data is returned, close connection and return results
    query.on('end', function(){
      client.end();
    });

    //handle errors
    if(err){
      console.log('deserialize error', err);
    }
  });
});

//Routes
app.use('/', index);

var server = app.listen(port, function(){
  var port = server.address().port;
  console.log('Listening on port', port, '. Use ctrl-c to exit.');
})
