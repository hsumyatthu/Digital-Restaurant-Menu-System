var mongoose = require('mongoose'); //mongodb module
var dateformat = require('dateformat');
//Define a schama
var Schema = mongoose.Schema;
var OrderSchema = new Schema({
  foods: [{
    food_id: {
      type: Schema.Types.ObjectId,
      ref: 'Foods',
    },
    count: {
      type: Number,
      require: true
    },
    price: {
      type: String,
      require: true,
    },
  }],
  tolprice: {
    type: Number,
    require: true,
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
  status:{
    type: String,
    default: "00" //00 is ordering 01 is checkout 11 is complete
  },
  inserted:{
    type: Date,
    default:Date.now
  },
  // updatedBy:{
  //   type: String
  // },
  // insertedBy:{
  //   type: String
  // }
});

OrderSchema.virtual('updated_date').get(function(){
  return dateformat(this.updated,'dd/mm/yyy HH:MM');
});

OrderSchema.virtual('inserted_date').get(function(){
  return dateformat(this.instered,'dd/mm/yyy HH:MM');
});

module.exports = mongoose.model('Orders' , OrderSchema);//Users: Collection
