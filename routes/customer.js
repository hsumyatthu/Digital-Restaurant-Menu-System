var express = require('express');
var router = express.Router();

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

module.exports = router;
