var mongoose = require('mongoose'); //mongodb module
var dateformat = require('dateformat');
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

UserSchema.virtual('updated_date').get(function () {
  return dateformat(this.updated, 'dd/mm/yyyy HH:MM');
});

UserSchema.statics.compare = function (cleartext,encrypted) {
  return bcrypt.compareSync(cleartext,encrypted);
};
module.exports =mongoose.model('Users',UserSchema);
