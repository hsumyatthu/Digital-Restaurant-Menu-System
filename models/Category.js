var mongoose = require('mongoose');//mongodb module
var dateformat = require('dateformat');
//Define a schema
var Schema = mongoose.Schema;
var CategorySchema = new Schema({  //define data fields
  main_cat: {
    type: String,
    require: true,
    trim: true //remove both-side with space
  },
   sub_cat: {
     type: String,
     require: true,
   },
  name: {
    type: String,
    require: true,
    trim: true //remove both-side white space
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

CategorySchema.virtual('updated_date').get(function(){
  return dateformat(this.updated,'dd/mm/yyy HH:MM');
});

CategorySchema.virtual('inserted_date').get(function(){
  return dateformat(this.instered,'dd/mm/yyy HH:MM');
});

module.exports = mongoose.model('Categories' , CategorySchema);//Users: Collection
