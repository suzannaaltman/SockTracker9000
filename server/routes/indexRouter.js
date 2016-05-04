var router = require('express').Router();
var path = require('path');

var sockRouter = require('./sockRouter');

router.get('/', function(request, response){
  response.sendFile(path.join(__dirname, '../public/views/front.html'));
})

//sockRouter
router.use('/socks', sockRouter);

module.exports = router;
