var bcrypt = require('bcrypt');

exports.cryptPassword = function(password) {
   bcrypt.genSalt(10, function(err, salt) {
    if (err) 
      return err;

    bcrypt.hash(password, salt, function(err, hash) {
      return hash;
    });
  });
};

exports.comparePassword = function(plainPass, hashword, callback) {
   bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
       return err == null ?
           callback(null, isPasswordMatch) :
           callback(err);
   });
};

// async function lmao(){
// await exports.cryptPassword('LMAO',async (err,hash)=>{
//      console.log(hash)
// })

//  exports.comparePassword("LMAO","$2b$10$WhYHoOzIS5K.WjNOVDw76OJw982haqX2c8kouB7Ebv0RNh.CLjbty",(err,flag)=>{
//     console.log(flag)
// })}

