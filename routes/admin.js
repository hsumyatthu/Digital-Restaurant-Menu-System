var express = require('express');
var router = express.Router();
var Menu = require('../models/Food');
var User = require('../models/User');
var Table = require('../models/Table');
var Order = require('../models/Order');
var multer = require('multer');
var Category = require('../models/Category');
var flash = require('express-flash');
var moment = require('moment');
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
    req.flash('forward', '/admin'+req.path);
    res.redirect('/signin');
    }
};
/* GET home page. */
router.get('/', function(req, res, next) {

  Order.count({inserted:{$lt: new Date(),$gte: new Date(new Date().setDate(new Date().getDate()-1))}},function (err,order) {
    if(err) throw err;
    console.log('////',order);
    res.render('admin/index', { title: 'Express',orderC:order });
  });
});

router.get('/addfood', function(req, res, next) {
  Category.find(function(err,rtn){
    if(err)  throw err;
    res.render('admin/food/add-food', { cat: rtn });
  });
});

router.get('/foodlist', function(req, res, next) {
  Menu.find({}).populate('category').exec(function(err,rtn){
    if(err) throw err;
      res.render('admin/food/food-list', { menu: rtn });
    });
});

router.get('/foodCatlist', function(req, res, next) {
  Category.find(function(err,rtn){
    if(err) throw err;
    res.render('admin/food/foodCat-list', { cat: rtn });
  });
});

router.get('/assignfoodCat', auth, function(req, res, next) {
  res.render('admin/food/assign-foodCat', { title: 'Express' });
});

router.get('/detail/:id', function(req, res, next) {
  Menu.findById({
    _id: req.params.id
  }, function(err, rtn) {
    if (err) throw err;
    Category.findById(rtn.category,function (err1,rtn1) {
      if(err1) throw err1;
      res.render('admin/food/food-detail', {menu: rtn,cat:rtn1});
    });
  });
});

router.get('/modify/:id', function(req, res, next) {
  Menu.findOne({_id:req.params.id}, function(err, rtn) {
    if(err) throw err;
    Category.find(function(err,cat){
      if(err)  throw err;
      res.render('admin/food/modify-food', {menu:rtn, cat:cat});
    });
  });
});

router.post('/modify', upload.single('uploadImg'), function(req, res, next) {
    var update = {
    fname : req.body.fname,
    imgUrl : '/images/uploads/' + req.file.filename,
    brief : req.body.brief,
    category: req.body.category,
    price : Number(req.body.price),
    description : req.body.description,
    additionalInfo : req.body.additionalInfo,
  };
    Menu.findByIdAndUpdate(req.body.menu_id, {$set: update}, function(err, menu) {
      if(err) throw (err);
      res.redirect('/admin/detail/' + menu._id);
    });
  });

  router.get('/delete/:id', function(req, res, next){
    Menu.findByIdAndRemove(req.params.id, function(err, menu){
      if(err) throw err;
      res.redirect('/admin/foodlist');
    });
  });

router.post('/addfood',upload.single('uploadImg'), function(req, res, next) {
  var menu = new Menu();
  Category.findOne({name : req.body.category},function (err1,rtn1) {
    if(err1) throw err1;
    menu.fname = req.body.fname;
    menu.category = rtn1._id;
    if (req.file) menu.imgUrl = '/images/uploads/' + req.file.filename;
    menu.price = req.body.price;
    menu.brief = req.body.brief;
    menu.description = req.body.description;
    menu.additionalInfo = req.body.additionalInfo;
    menu.save(function(err,rtn){
      if (err)throw err;
      res.redirect('/admin/detail/'+rtn._id);
    });
  });
});

router.post('/assignfoodCat', function(req, res, next) {
  var category = new Category();
  category.name = req.body.cat_name;
  category.save(function(err,rtn){
    if (err)throw err;
    res.redirect('/admin/foodCatlist');
  });
});

router.get('/deleteCat/:id', function(req, res, next){
  Category.findByIdAndRemove(req.params.id, function(err, cat){
    if(err) throw err;
    res.redirect('/admin/foodCatlist');
  });
});

router.post('/duplicateCat', function(req, res, next){
  Category.findOne({ name: req.body.cat_name}, function(err,rtn){
    if(err) throw err;
    if(rtn != null) res.json({ status: false, msg: 'Duplicate category name!!!'});
    else res.json({ status: true });
  });
});

router.get('/assigntb', function(req, res, next) {
  res.render('admin/table/assign-table', { title: 'Express' });
});

router.post('/assigntb', function(req, res, next) {
  var table = new Table();
  table.id = req.body.id;
  table.password = req.body.password;
  table.tnumber = req.body.tnumber;

  table.save(function(err,rtn){
    if (err)throw err;
    res.redirect('/admin/tblist');
  });
});

router.get('/tblist', function(req, res, next) {
  Table.find(function(err,rtn){
    if(err) throw err;
    res.render('admin/table/table-list', { table: rtn });
  });
});

router.get('/deleteTb/:id', function(req, res, next){
  Table.findByIdAndRemove(req.params.id, function(err, tb){
    if(err) throw err;
    res.redirect('/admin/tblist');
  });
});

router.post('/duplicateTb', function(req, res, next){
  Table.findOne({$or: [{tnumber: req.body.tnumber}, {id: req.body.tid}] }, function(err,rtn){
    if(err) throw err;
    if(rtn != null) res.json({ status: false, msg: 'Duplicate Table Number & ID!!!'});
    else res.json({ status: true });
  });
});

router.get('/sale', function(req, res, next) {
  Order.find({}).populate('foods.food_id').exec(function(err, rtn){
    if(err) throw err;
    console.log(rtn);
    res.render('admin/food/sale-history', {order:rtn });
  });
});

router.get('/saledetail/:id', function(req, res, next) {
  Order.findById(req.params.id).populate('foods.food_id').exec(function(err, rtn){
    if(err) throw err;
    console.log(rtn);
      res.render('admin/food/sale-detail', {order:rtn});
  });
});

router.post('/duplicatefname', function(req, res, next){
  console.log('call');
  Menu.findOne({ fname: req.body.fname}, function(err,rtn){
    if(err) throw err;
    if(rtn != null) res.json({ status: false, msg: 'Duplicate food name!!!'});
    else res.json({ status: true });
  });
});

router.get('/adminmodify', function(req, res, next){
  User.find(function(err,rtn){
    if(err) throw err;
    console.log(rtn[0]);
    res.render('admin/admin-modify', { user: rtn[0]});
  });
});

router.post('/adminmodify', function (req, res, next) {
  console.log(req.body.id);
  var update = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  User.findByIdAndUpdate( req.body.id,{$set: update}, function(err, rtn){
    if (err) throw err;
     res.redirect('/admin');
  });
});

module.exports = router;
