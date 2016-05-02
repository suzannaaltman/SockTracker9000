var express = require('express');
var index = require('./routes/indexRouter');
var app = express();

app.use(express.static('server/public'));

app.use('/', index);

var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log('Listening on port', port, '. Use ctrl-c to exit.');
})
