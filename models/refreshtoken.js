var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var refreshTokenSchema = new Schema(
  {
    email: {type: String, required: true, maxlength: 200},
    token1: {type: String, required: true, maxlength: 200},
    token2: {type: String, required: true, maxlength: 200},
    token3: {type: String, required: true, maxlength: 200},
    line: {type: Number, required: true, maxlength: 50},
    expired: {type: Boolean, required: true, maxlength: 100}
  }, { versionKey: false }
);


const refreshToken= mongoose.model('refreshToken', refreshTokenSchema);
//Export model
module.exports = refreshToken