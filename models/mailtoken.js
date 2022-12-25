var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TokenSchema = new Schema(
  {
    email: {type: String, required: true, maxlength: 200, unique:true,index:true},
    token: {type: String, required: true, maxlength: 100},
    expdate:{type: Date, required: true}
  }, { versionKey: false }
);


const Token= mongoose.model('Token', TokenSchema);
Token.createIndexes();
//Export model
module.exports = Token