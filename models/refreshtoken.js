var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var refreshTokenSchema = new Schema(
  {
    email: {type: String, required: true, maxlength: 200, unique:true,index:true},
    currenttoken: {type: String, required: true, maxlength: 200},
    previoustokens: [{type: String, required: true, maxlength: 100}]
  }, { versionKey: false }
);


const refreshToken= mongoose.model('refreshToken', refreshTokenSchema);
refreshToken.createIndexes();
//Export model
module.exports = refreshToken