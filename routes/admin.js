var express = require('express');
var router = express.Router();
var Menu = require('../models/Food');
var multer = require('multer');
var Category = require('../models/Category');
var upload = multer({
  dest: 'public/images/uploads'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'Express' });
});

router.get('/addfood', function(req, res, next) {
  Category.find(function(err,rtn){
    if(err)  throw err;
    res.render('admin/food/add-food', { cat: rtn });
  });
});

router.get('/foodlist', function(req, res, next) {
  Menu.find(function(err,rtn){
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

router.get('/assignfoodCat', function(req, res, next) {
  res.render('admin/food/assign-foodCat', { title: 'Express' });
});

router.get('/detail/:id', function(req, res, next) {
  Menu.findById({
    _id: req.params.id
  }, function(err, rtn) {
    if (err) throw err;

        res.render('admin/food/food-detail', {menu: rtn});
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
    price : req.body.price,
    description : req.body.description,
    additionalInfo : req.body.additionalInfo,
  };
    Menu.findByIdAndUpdate(req.body.menu_id, {$set: update}, function(err, menu) {
      if(err) throw (err);
      res.json({
        status: true,
        msg: 'success',
        id: menu
      });
    });
  });

  router.get('/delete/:id', function(req, res, next){
    Menu.findByIdAndRemove(req.params.id, function(err, menu){
      if(err) throw err;
      res.redirect('/admin/foodlist');
    });
  });

router.post('/addfood',upload.single('uploadImg'), function(req, res, next) {
  console.log('///////',req.body);
  var menu = new Menu();
  menu.fname = req.body.fname;
  menu.category = req.body.category;
  if (req.file) menu.imgUrl = '/images/uploads/' + req.file.filename;
  menu.price = req.body.price;
  menu.brief = req.body.brief;
  menu.description = req.body.description;
  menu.additionalInfo = req.body.additionalInfo;

  menu.save(function(err,rtn){
    if (err)throw err;
    res.redirect('/admin/foodlist');
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

module.exports = router;
