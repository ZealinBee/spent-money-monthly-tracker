const jwt = require("jsonwebtoken");

exports.auth = async function (req) {
  const token = await req.header("Authorization").replace('Bearer ', '');
  if (!token) {
    return false;
  }
  let result;
  await jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      result=false;}
    else{
    result=decoded;}
  });
  return result;

};
