var router = require('express').Router();
var path = require('path');
var passport = require('passport');

var sockRouter = require('./sockRouter');
var registerRouter = require('./registerRouter');


router.get('/', function(request, response, next){
  console.log('front page called with \'\/\'');
  response.sendFile(path.join(__dirname, '../public/views/front.html'));
})

router.post('/',
  passport.authenticate('local', {
    successRedirect:'/socks',
    failureRedirect: '/stinky'
  })
);

router.get('/logout', function(request, response){
  request.logout();
  // console.log('user logged out');
  response.redirect('/');
})

router.get('/stinky', function(request, response){
  console.log('stinky called');
  response.sendFile(path.join(__dirname, '../public/views/stinky.html'));
})






module.exports = router;
