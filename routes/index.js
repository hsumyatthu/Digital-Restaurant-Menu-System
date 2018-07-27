var express = require('express');
var router = express.Router();
var User = require('../models/User');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signin', function(req, res, next) {
  res.render('commons/signin', { title: 'Sign In' });
});

router.post('/signin', function(req, res, next) {
  var user = new User();
  User.findOne({ email: req.body.emailIn}, function (err,user){
    if(err) throw err;
    res.redirect('/admin');
  });
});

router.post('/signup', function(req, res, next) {
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.save(function (err, rtn) {
    if(err) throw err;
    res.redirect('/signin');
  });
});

module.exports = router;
