const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("./models/user");
const Token = require("./models/mailtoken");
const refreshTokenModel = require("./models/refreshtoken");
const crypt = require("./cryptography");
const auth = require("./service/authentication");
const mailer = require("./mail.js");
const router = express.Router();


const saverefreshtoken=async (refreshToken,email,line,remembered)=>{
  let num=line
  let allbusy=true
  if (line===0){
  num=1
  tokens=await refreshTokenModel.findOne({email:email,line:num})
  while (tokens){
  if (num==10){
    for (let i=1;i<=10;i++){
      token=await refreshTokenModel.findOne({email:email,line:i})
      if (!token.remembered) {allbusy=false;break;}
    }
    if (!allbusy)
    refreshTokenModel.deleteMany({email:email,line:i})
    else return false
    num=0
  }
  num++;
  tokens=await refreshTokenModel.findOne({email:email,line:num})
  }}
  crypt.cryptToken(refreshToken).then((hash)=>{
        refrtoken = new refreshTokenModel({
          email:email,
          token1:hash[0],
          token2:hash[1],
          token3:hash[2],
          line:num,
          remembered:remembered,
          expired: false,
        }).save();
      })
  return num
}

const deleteRefreshToken=async(email,line)=>{
  await refreshTokenModel.deleteMany({email:email,line:line,remembered:false}, (err, result) => {
    if (err) {
      console.log(false)
    } else {
      console.log(true)
    }
  });
}

router.post("/refresh", async (req, res) => {
  try {
    token = req.header("Authorization");
    if (!token) return res.status(400).json({ message: "Bad request1" });
    auth.refrcheck(req).then(async (result) => {
      if (!result) {
        return res.status(400).json({ message: "Bad request1.5" });
      }
    const email=result.email
    tokensDB = await refreshTokenModel.find({email:email});
    isfound=false
    tokenDB=0;
    let num=0
    tokensDB.forEach(tokenelem  => {
      num++
      if ((bcrypt.compareSync(token.slice(0,50),tokenelem.token1))&&(bcrypt.compareSync(token.slice(50,100),tokenelem.token2))&&(bcrypt.compareSync(token.slice(100,token.length),tokenelem.token3))){
      isfound=true
      tokenDB=tokenelem
      }
    });
    if (!isfound) return res.status(400).json({ message: "Bad request2" });
    remembered=tokenDB.remembered
    if (tokenDB.expired) {
      await refreshTokenModel.deleteMany(
        { email: email },
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: "Bad request2.5" });
          }
        }
      );
      return res.status(400).json({ message: "Bad request3" });
    }
    await refreshTokenModel.findOneAndUpdate(
      { token1: tokenDB.token1,token2: tokenDB.token2,token3: tokenDB.token3 },
      { expired: true },
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Bad request4" });
        }
      }
    );
    token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
      expiresIn: "3s",
    });
    refreshToken = jwt.sign(
      {
        email: email,
      },
      process.env.REFRESH_TOKEN_SECRET
    );
    saverefreshtoken(refreshToken,email,tokenDB.line,remembered)
    return res
      .status(201)
      .json({ message: true, token: token, refreshtoken: refreshToken });})
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/forget-password", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.find({ email: req.body.email });
    if (!user[0]) return res.status(400).send({ message: false });
    let token = await Token.find({ email: req.body.email });
    if (!token[0])
      token = await new Token({
        email: req.body.email,
        token: crypto.randomBytes(32).toString("hex"),
        expdate: new Date(new Date().getTime() + 30 * 60000),
      }).save();
    else {
      await Token.findOneAndUpdate(
        { email: req.body.email },
        {
          token: crypto.randomBytes(32).toString("hex"),
          expdate: new Date(new Date().getTime() + 30 * 60000),
        },
        { new: true },
        async (err, result) => {
          if (err) return res.status(500).json({ message: err.message });
        }
      );
    }
    token = await Token.find({ email: req.body.email });
    const link = `${process.env.BASE_URL}/password-reset/${user[0]._id}/${token[0].token}`;
    mailer.sendMail(
      email,
      `Hey, here is the link to reset your password:\n ${link}\nThe link will expire in 30 minutes.\nPrevious links won't work.`
    );
    return res.status(200).json({ message: "send" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put("/password-reset/:userid/:token", async (req, res) => {
  try {
    const userId = req.params.userid;
    const userInfo = await User.findById(`${userId}`);
    const now = new Date();
    const token=req.params.token
    const tokenInfo = await Token.find({ token: token });
    if (tokenInfo[0].expdate < now){
      return res.status(400).send("invalid link");}
    const userEmail = userInfo.email;
    const tokenEmail = tokenInfo[0].email;
    if (userEmail === tokenEmail) {
      crypt.cryptPassword(req.body.password).then((hash) => {
        User.findOneAndUpdate(
          { email: userEmail },
          { password: hash },
          { new: true },
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            } else {
              Token.deleteOne({token:token},(err, result) => {
                    if (err) {
                      
                      return res.status(500).json({ message: err.message });
                    }
                    else {
                        console.log(req.body.id)
                        res.status(200).json({ result: "done" });
                    }})
              
            }
          }
        );
        
      });
    }
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: err.message });
  }
});

router.post("/register", async (req, res) => {
  let user;
  crypt
    .cryptPassword(req.body.password)
    .then(async (hash) => {
      user = new User({
        email: req.body.email,
        password: hash,
        totalHave: 0,
        totalSpend: 0,
      });
      token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY, {
        expiresIn: "3s",
      });
      refreshToken = jwt.sign(
        {
          email: req.body.email,
        },
        process.env.REFRESH_TOKEN_SECRET
      );
      result=await saverefreshtoken(refreshToken,req.body.email,0,false)
      if (!result) return res.status(500).json({ message: 'too many devices' });
      return user;
    })
    .then(async () => {
      try {
        await user.save();
        setTimeout(() => {
          deleteRefreshToken(req.body.email,result)
        }, 1000*60*30)
        return res
          .status(201)
          .json({ message: true, token: token, refreshtoken: refreshToken });
      } catch (err) {
        if (err.code == 11000) return res.status(500).json({ message: false });
        return res.status(500).json({ message: err.message });
      }
    });
});



router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (!user[0]) return res.status(500).json({ message: "doesn't exist" });
    let answer = false;
    let token = "0";
    let refreshtoken = "0";
    let totalHave = 0;
    let totalSpend = 0;
    const hashword = user[0].password;
    const totalHaveUser = user[0].totalHave;
    const totalSpendUser = user[0].totalSpend;
    const email = req.body.email;
    if (bcrypt.compareSync(req.body.password, hashword)) {
      answer = true;
      totalHave = totalHaveUser;
      totalSpend = totalSpendUser;
      token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
        expiresIn: "3s",
      });
        refreshToken = jwt.sign(
          {
            email: req.body.email,
          },
          process.env.REFRESH_TOKEN_SECRET
        );
        result=await saverefreshtoken(refreshToken,req.body.email,0,req.body.remembered)
        if (!result) return res.status(500).json({ message: "too many devices" });
    }
    setTimeout(() => {
      deleteRefreshToken(req.body.email,result)
    }, 10000*60*30)
    return res.status(200).json({
      answer: answer,
      totalSpend: totalSpend,
      totalHave: totalHave,
      token: token,
      refreshtoken: refreshToken,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

router.put("/money", async (req, res) => {
  auth.auth(req).then(async (result) => {
    if (!result) {
      return res.status(400).json({ message: result });
    }
    await User.findOneAndUpdate(
      { email: result.email },
      req.body,
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        } else {
          res.status(200).json({ result: result });
        }
      }
    );
  });
});


router.delete("/deleterefresh", async (req, res) => {
  let refreshtoken=await req.header("Authorization")
  let tokenInfo=await refreshTokenModel.findOne({token:refreshtoken})
  let email=tokenInfo.email
  await refreshTokenModel.deleteMany({email:email}, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      res.status(200).json({ result: "Done" });
    }
  });
});

router.get("/password-reset/:userid/:token", async (req, res) => {
  try{
  emailtoken=await Token.findOne({token:req.params.token})
  userInfo = await User.findById(`${req.params.userid}`);
  if (!userInfo|| !emailtoken) return res.sendFile(path.join(__dirname + "/404.html"));
  res.sendFile(path.join(__dirname + "/password-reset.html"));
  }
  catch(err){
    res.sendFile(path.join(__dirname + "/404.html"));
  }
});

router.get("/daysCount.js", async (req, res) => {
  res.sendFile(path.join(__dirname + "/daysCount.js"));
});

router.get("/index.js", async (req, res) => {
  res.sendFile(path.join(__dirname + "/index.js"));
});

router.get("/main.js", async (req, res) => {
  res.sendFile(path.join(__dirname + "/main.js"));
});

router.get("/main.css", async (req, res) => {
  res.sendFile(path.join(__dirname + "/main.css"));
});

router.get("/style.css", async (req, res) => {
  res.sendFile(path.join(__dirname + "/style.css"));
});

router.get("/script.js", async (req, res) => {
  res.sendFile(path.join(__dirname + "/script.js"));
});

router.get("/forgotpassword.css", async (req, res) => {
  res.sendFile(path.join(__dirname + "/forgotpassword.css"));
});
router.get("/forgotpassword.js", async (req, res) => {
  res.sendFile(path.join(__dirname + "/forgotpassword.js"));
});

router.get("/public/assets/background.jpg", async (req, res) => {
  res.sendFile(path.join(__dirname + "/public/assets/background.jpg"));
});
router.get("/public/assets/icon.png", async (req, res) => {
  res.sendFile(path.join(__dirname + "/public/assets/icon.png"));
});



module.exports = router;
