var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Menu = require('../models/Food');
var Table = require('../models/Table');
var multer = require('multer');
var moment = require('moment');
var Category = require('../models/Category');
var Order = require('../models/Order');
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
    res.redirect('/signin');
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  var today = moment().startOf('day');
  var tomorrow = moment(today).endOf('day');
  console.log('////',today,tomorrow);
  Order.find({inserted:{$lt: tomorrow.toDate(),$gte: today.toDate()}},function (err,order) {
    if(err) throw err;
    console.log('////',order);
    res.render('index', { title: 'Express' });
  });
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
    var user_cookie = {name: user.name, id: user._id, email: user.email };
    res.cookie('user_cookie', user_cookie);
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
    req.flash( 'success', 'Registration successful.' );
    res.redirect('/signin');
  });
});

router.post('/signup/duplicate', function(req, res, next){
  User.findOne({ email: req.body.email}, function(err,rtn){
    if(err) throw err;
    if(rtn != null) res.json({ status: false, msg: 'Duplicate owner email!!!'});
    else res.json({ status: true });
  });
});

router.get('/signout',function (req,res) {
  req.session.destroy();
  res.redirect('/');
});

router.get('/login', function(req, res, next) {
    res.render('commons/login', { title: 'Log In' });
});

router.post('/login', function(req, res, next) {
  Table.findOne({ id: req.body.id}, function (err,table){
    if(err) throw err;
    if( table == null || !Table.compare( req.body.password, table.password )) {
    req.flash( 'warn', 'ID not exists or password not matched!!' );
    res.redirect('/login');
  }else{
    var table_cookie = {name: table.tnumber, id: table._id, tnumber: table.tnumber };
    res.cookie('table_cookie', table_cookie);
    req.session.table = { name: table.tnumber, id: table._id };
    res.redirect('/customer/home');
  }
  });
});

router.get('/init', function(req, res, next) {
  var user = new User();
  user.name = 'Admin';
  user.email = 'admin@gmail.com';
  user.password = 'Ad12345';
  user.save(function(err, result){
    if(err) throw err;
    req.flash('success', 'Registration successful. Welcome to' +user.name);
  res.redirect('/signin' );
  });
});

module.exports = router;
