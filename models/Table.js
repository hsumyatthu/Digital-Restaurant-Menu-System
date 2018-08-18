var mongoose = require('mongoose'); //mongodb module
var dateformat = require('dateformat');
var bcrypt = require('bcrypt-nodejs');
//Define a schama
var Schema = mongoose.Schema;
var TableSchema = new Schema({
  id: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  tnumber: {
    type: String,
    required: true,
    trim: true
  },
  updated:{
    type: Date,
    default:Date.now
  },
  instered:{
    type: Date,
    default:Date.now
  },
  updatedBy:{
    type: String
  },
  insteredBy:{
    type: String
  }
});

//hashing a password before saving it to the database
TableSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8),null);
  next();
});

TableSchema.virtual('updated_date').get(function () {
  return dateformat(this.updated, 'dd/mm/yyyy HH:MM');
});

TableSchema.statics.compare = function (cleartext,encrypted) {
  return bcrypt.compareSync(cleartext,encrypted);
};
module.exports =mongoose.model('Tables',TableSchema);
