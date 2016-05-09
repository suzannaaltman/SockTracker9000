var router = require('express').Router();
var path = require('path');
var passport = require('passport');

var sockRouter = require('./sockRouter');
var registerRouter = require('./registerRouter');


router.get('/', function(request, response, next){
  console.log('stinky?, / called');
  response.sendFile(path.join(__dirname, '../public/views/front.html'));
})

router.get('/stinky', function(request, response){
  console.log('stinky called');
  response.sendFile(path.join(__dirname, '../public/views/stinky.html'));
})

router.get('/logout', function(request, response){
  request.logout();
  // console.log('user logged out');
  response.redirect('/');
})

router.post('/',
  passport.authenticate('local', {
    successRedirect:'/socks',
    failureRedirect:'/stinky'
  })
);


//Routers
router.use('/socks', sockRouter);
router.use('/register', registerRouter);


module.exports = router;
