var express = require('express');
var router = express.Router();
var flash = require('express-flash');
var Menu = require('../models/Food');
var User = require('../models/User');
var Order = require('../models/Order');
var Category = require('../models/Category');

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

router.get('/home', function(req, res, next) {
  Menu.find({}).sort({count:-1}).limit(8).exec(function(err, rtn){
    if(err) throw err;
    Menu.find({today:'1'},function (err2,rtn2) {
      if(err2) throw err2;
      res.render('customer/index2', { title: 'Express', fav: rtn, today:rtn2 });
    });

  });
});

router.get('/about', function(req, res, next) {
  res.render('customer/food/about', { title: 'Express' });
});

router.all('/list', function(req, res, next) {
  var params = [req.body.keyword ||'',req.body.category ||'',req.body.sorting];
  // if(req.body.category!=null){
  //   params[1].push(req.body.category);
  // }
  // if(req.body.keyword)
  console.log(params);
  var count = (Number(req.body.count)-1)*6 || 0;
  var sort = Number(req.body.sorting) || 1;
  console.log(count,sort);
  var query = {fname: (params[0]=='')?{$exists:true}:{'$regex':params[0],'$options':'i'}, category: (params[1]=='')?{$exists:true}:params[1],today: '0'};
  Menu.find(query).limit(6).skip(count).sort({price:sort}).exec(function(err,rtn){
    if(err) throw err;
    if(req.cookies.cart){
      console.log('have',req.cookies.cart.length);
      if(req.cookies.cart==null)console.log('null');
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
    Category.find(function(err2,rtn2){
      if(err2) throw err2;
      Menu.count(query,function (err3,rtn3) {
        if(err3) throw err3;
        res.render('customer/food/food-list', { menu: rtn, cat:rtn2, count:rtn3, dcount: Number(req.body.count), sort:sort, category:params[1], keyword:params[0]});
      });
    });
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
  for(var y in req.cookies.cart.items){
    keys.push(req.cookies.cart.items[y].id);
  }
  Menu.find({ _id:{ $in: keys}
  }, function(err, rtn){
    if(err) throw err;
    res.render('customer/food/cart',{ itemdata: rtn});
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
    Menu.findByIdAndUpdate(req.body.ordertol[k].id, {$inc:{count:1}}, function(err2, rtn2){
      if(err2) throw err2;
      console.log('increase');
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
