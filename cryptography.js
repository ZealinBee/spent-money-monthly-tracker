var bcrypt = require("bcryptjs");

exports.cryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;

}

exports.cryptToken = async function (token) {
    const salt = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash(token.slice(0,50), salt);
    const hash2 = await bcrypt.hash(token.slice(50,100), salt);
    const hash3 = await bcrypt.hash(token.slice(100,token.length), salt);
    const hash=[hash1,hash2,hash3]
    return hash;

}