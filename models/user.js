var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {type: String, required: true, maxlength: 200, unique:true,index:true},
    password: {type: String, required: true, maxlength: 100},
    totalHave:{type: Number, required: true},
    totalSpend:{type: Number, required: true}
  }, { versionKey: false }
);


const User= mongoose.model('User', UserSchema);
User.createIndexes();
//Export model
module.exports = User