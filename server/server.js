var express = require('express');
var index = require('./routes/indexRouter');
var connection = require('./db/connection');
var bodyParser = require('body-parser');

var app = express();

var port = process.env.PORT || 3000;

app.use(express.static('server/public'));

app.use('/', index);

connection.initializeDB();

var server = app.listen(port, function(){
  var port = server.address().port;
  console.log('Listening on port', port, '. Use ctrl-c to exit.');
})
