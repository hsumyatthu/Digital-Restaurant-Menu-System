var express = require('express');
var router = express.Router();
var Menu = require('../models/Food');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('customer/index1', { title: 'Express' });
});

router.get('/2', function(req, res, next) {
  res.render('customer/index2', { title: 'Express' });
});

router.get('/3', function(req, res, next) {
  res.render('customer/index3', { title: 'Express' });
});

router.get('/foodlist', function(req, res, next) {
  Menu.find(function(err,rtn){
    if(err) throw err;
  res.render('customer/food/food-list', { menu: rtn});
  });
});

router.get('/detail/:id', function(req, res, next) {
  Menu.findOne({_id:req.params.id},function(err,rtn){
    if(err) throw err;
  // res.render('customer/food/food-detail', { menu: rtn});
  res.end('Data is ', rtn);
  });
});

module.exports = router;
