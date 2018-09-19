var mongoose = require('mongoose'); //mongodb module
var dateformat = require('dateformat');
var bcrypt = require('bcrypt-nodejs');
//Define a schama
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true //remove both-side with space
},
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  updated:{
    type: Date,
    default:Date.now
  },
  inserted:{
    type: Date,
    default:Date.now
  },
});

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8),null);
  next();
});

UserSchema.virtual('updated_date').get(function () {
  return dateformat(this.updated, 'dd/mm/yyyy HH:MM');
});

UserSchema.statics.compare = function (cleartext,encrypted) {
  return bcrypt.compareSync(cleartext,encrypted);
};

UserSchema.statics.change = function (cleartext) {
  return bcrypt.hashSync(cleartext, bcrypt.genSaltSync(8),null);
};

module.exports =mongoose.model('Users',UserSchema);
