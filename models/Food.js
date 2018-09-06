var mongoose = require('mongoose');//mongodb module
var dateformat = require('dateformat');
//Define a schema
var Schema = mongoose.Schema;
var FoodSchema = new Schema({  //define data fields
  fname: {
    type: String,
    require: true,
    trim: true //remove both-side white space
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Categories',
  },
  price: {
    type: Number,
    require: true,
    trim: true
  },
  count: {
    type: Number,
    default: 0
  },
  today: {
    type: String,
    default: 0 //0 is nomal 1 is today special
  },
  imgUrl: {
      type: String,
      // required: true,
  },
  brief: {
      type: String,
      required: true,
      trim: true,
  },
  description: {
      type: String,
      required: true,
      trim: true,
  },

  updated: {
      type: Date,
      default: Date.now
  },
inserted: {
  type: Date,
default:Date.now
},

});
//hashing a password before saving it to the database

FoodSchema.virtual('updated_date').get(function(){
  return dateformat(this.updated,'dd/mm/yyy HH:MM');
});

FoodSchema.virtual('inserted_date').get(function(){
  return dateformat(this.instered,'dd/mm/yyy HH:MM');
});
module.exports = mongoose.model('Foods' , FoodSchema);//Users: Collection
