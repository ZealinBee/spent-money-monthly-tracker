var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var refreshTokenSchema = new Schema(
  {
    email: {type: String, required: true, maxlength: 200},
    token: {type: String, required: true, maxlength: 200},
    expired: {type: Boolean, required: true, maxlength: 100}
  }, { versionKey: false }
);


const refreshToken= mongoose.model('refreshToken', refreshTokenSchema);
//Export model
module.exports = refreshToken