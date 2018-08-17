var express = require('express');
var router = express.Router();
var Menu = require('../models/Food');

/* GET home page. */

router.get('/home', function(req, res, next) {
  res.render('customer/index2', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
  res.render('customer/food/about', { title: 'Express' });
});


router.get('/list', function(req, res, next) {
  Menu.find(function(err,rtn){
    if(err) throw err;
  res.render('customer/food/food-list', { menu: rtn});
  });
});

router.get('/detail/:id', function(req, res, next) {
  Menu.findOne({_id:req.params.id},function(err,rtn){
    if(err) throw err;
  res.render('customer/food/food-detail', { menu: rtn});
  });
});

router.get('/cart', function(req, res, next){
  res.render('customer/food/cart');
});

module.exports = router;
