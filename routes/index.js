var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Menu = require('../models/Food');
var multer = require('multer');
var Category = require('../models/Category');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var upload = multer({
  dest: 'public/images/uploads'
});

var auth = function(req, res, next) {
  if (req.session.user) {
    return next();
  } else{
    req.flash('warn','You need to signin');
    console.log('request path',req.path);
    req.flash('forward', req.path);
    res.redirect('/signup');
    }
};

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
    if( user == null || !User.compare( req.body.passwordIn, user.password )) {
    req.flash( 'warn', 'Email not exists or password not matched!!' );
    res.redirect('/signin');
  }else{
    req.session.user = { name: user.name, email: user.emailIn, id: user._id };
    res.redirect('/admin');
  }
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

router.post('/signup/duplicate', function(req, res, next){
  User.findOne({ email: req.body.email}, function(err,rtn){
    if(err) throw err;
    if(rtn != null) res.json({ status: false, msg: 'Duplicate user id!!!'});
    else res.json({ status: true });
  });
});

module.exports = router;
