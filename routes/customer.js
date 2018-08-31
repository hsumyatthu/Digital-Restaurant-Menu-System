var express = require('express');
var router = express.Router();
var flash = require('express-flash');
var Menu = require('../models/Food');
var User = require('../models/User');
var Order = require('../models/Order');

/* GET home page. */
var auth = function(req, res, next) {
  if (req.session.table) {
    return next();
  } else{
    req.flash('warn','You need to signin');
    console.log('request path',req.path);
    req.flash('forward', '/customer'+req.path);
    res.redirect('/login');
    }
};

router.get('/home', auth, function(req, res, next) {
  res.render('customer/index2', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
  res.render('customer/food/about', { title: 'Express' });
});


router.get('/list', function(req, res, next) {
  Menu.find(function(err,rtn){
    if(err) throw err;
    if(req.cookies.cart){
      console.log('have',req.cookies.cart);
      for(var i in rtn){
        for(var j = 0; j< req.cookies.cart.items.length; j++){
          if(req.cookies.cart.items[j].id == rtn[i]._id){
            rtn[i].cart = true;
            console.log('same');
            break;
          }
        }
      }
    }
    console.log(rtn);
    res.render('customer/food/food-list', { menu: rtn});
  });
});

router.get('/detail/:id', function(req, res, next) {
  Menu.findById(req.params.id).populate('category').exec(function(err,rtn){
    if(err) throw err;
    User.findById(rtn.insertedBy, function(err2, rtn2){
      if(err2) throw err2;
      if(!req.cookies.cart){
        rtn.cart = false;
      }else{
        for(var j = 0; j< req.cookies.cart.items.length; j++){
          if(req.cookies.cart.items[j].id == rtn._id){
            rtn.cart = true;
            break;
          }
        }
        res.render('customer/food/food-detail', { menu: rtn});
      }
    });
  });
});

router.get('/cart', function(req, res, next){
  if(!req.cookies.cart) { res.render('customer/food/cart', { itemdata: [] });
}else{
  var keys = [];
  var prices = [];
  for(var y in req.cookies.cart.items){
    keys.push(req.cookies.cart.items[y].id);
    prices.push(req.cookies.cart.items[y].price);
  }
  Menu.find({ _id:{ $in: keys}
  }, function(err, rtn){
    if(err) throw err;
    res.render('customer/food/cart',{ itemdata: rtn, prices: prices});
  });
  }
});

router.post('/addcart', function(req, res, next){
  var items = req.cookies.cart;
  if(!items) items= {
    items: []
  };
  items.items.push({
    id: req.body.id,
    price: req.body.price,
    name: req.body.name
  });
  console.log('data', items);
  res.cookie('cart', items);
  console.log(req.cookies);
  res.json({
    status: true,
    msg: 'success',
  });
});

router.get('/remove/:id', function(req, res, next){
  for (var i = 0; i < req.cookies.cart.items.length; i++) {
    if (req.cookies.cart.items[i].id == req.params.id) {
      req.cookies.cart.items.splice(i, 1);
    }
  }
  var items = req.cookies.cart;
  res.cookie('cart', items);
  res.redirect('/customer/cart');
});

router.get('/order/:id', function(req, res, next) {
  Order.findById(req.params.id).populate('foods.food_id').exec(function (err,rtn) {
    if(err) throw err;
    console.log('oooo',rtn.foods[0].food_id);
    res.render('customer/food/order', { title: 'Express',order: rtn });
  });
});

router.post('/orderlist', function(req, res, next) {
  var order = new Order();
  order.tolprice = req.body.tolp;
  order.tnumber = req.body.tbnum;
  console.log(req.body.ordertol);
  for (var k in req.body.ordertol) {
    order.foods.push({
      food_id: req.body.ordertol[k].id,
      count: req.body.ordertol[k].count,
      price: req.body.ordertol[k].price
    });
  }

  order.save(function(err,rtn){
    if (err)throw err;
    res.json({
      status: true,
      msg: 'success',
      data: rtn,
    });
  });
});

router.post('/checkout/:id', function (req, res, next) {
  console.log('call');
  Order.findByIdAndUpdate(req.params.id,{$set:{ status:"01"}},function (err,rtn) {
    if(err) throw err;
    res.json({
      status: true,
      msg: 'success',
      data: rtn,
    });
  });
});

module.exports = router;
