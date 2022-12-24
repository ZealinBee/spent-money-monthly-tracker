const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("./models/user");
const Token = require("./models/token");
const crypt = require("./cryptography");
const auth = require("./service/authorization");
const mailer = require("./mail.js");
const router = express.Router();

router.post("/forget-password", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.find({ email: req.body.email });
    if (!user[0]) return res.status(400).send("invalid email");
    let token = await Token.find({ email: req.body.email });
    if (!token[0])
      token = await new Token({
        email: req.body.email,
        token: crypto.randomBytes(32).toString("hex"),
        expdate: new Date(new Date().getTime() + 30 * 60000),
      }).save();
    else if (token[0].expdate < now)
      Token.findOneAndUpdate(
        { email: req.body.email },
        {
          token: crypto.randomBytes(32).toString("hex"),
          expdate: new Date(new Date().getTime() + 30 * 60000),
        },
        { new: true },
        async (err, result) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          } else {
            token = await Token.find({ email: req.body.email })
            const link = `${process.env.BASE_URL}/password-reset/${user[0]._id}/${token[0].token}`;
            mailer.sendMail(
              email,
              `That's your link bitch.\n ${link}\nThe link will expire in 30 minutes.`
            );
            return res.status(200).json({ message: "send" });
          }
        }
      );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/password-reset/:userid/:token", async (req, res) => {
  try {
    const userId = req.params.userid;
    const token = req.params.token;
    const userInfo = await User.findById(`${userId}`);
    const now=new Date()
    if (!userInfo) return res.status(400).send("invalid link");
    const tokenInfo = await Token.find({ token: token });
    if ((!tokenInfo[0])||(tokenInfo[0].expdate<now)) return res.status(400).send("invalid link");
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
              res.status(200).json({ result: "done" });
            }
          }
        );
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/register", async (req, res) => {
  let user;
  crypt
    .cryptPassword(req.body.password)
    .then((hash) => {
      user = new User({
        email: req.body.email,
        password: hash,
        totalHave: 0,
        totalSpend: 0,
      });
      token = jwt.sign(
        { email: req.body.email, totalHave: 0, totalSpend: 0 },
        process.env.SECRET_KEY
      );
      return user;
    })
    .then(async () => {
      try {
        await user.save();
        return res.status(201).json({ message: true, token: token });
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
      token = jwt.sign(
        { email: email, totalHave: totalHave, totalSpend: totalSpend },
        process.env.SECRET_KEY
      );
    }
    return res.status(200).json({
      answer: answer,
      totalSpend: totalSpend,
      totalHave: totalHave,
      token: token,
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
    if (!result) return res.status(400).json({ message: "Bad request" });
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

router.get("/password-reset/:userid/:token", async (req, res) => {
  res.sendFile(path.join(__dirname + "/password-reset.html"));
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

router.delete("/delete", async (req, res) => {
  await User.deleteMany({}, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      res.status(200).json({ result: "Done" });
    }
  });
});

// router.get("/cars", async (req, res) => {
//   try {
//     const cars = await Car.find();
//     res.send(cars)
//   } catch(err) {
//     return res.status(500).json({ message: err.message });
//   }
// })

// router.post("/cars", async (req, res) => {
//   const car = new Car({
//     brand: req.body.brand,
//     model: req.body.model,
//     color: req.body.color,
//     year: req.body.year
//   });

//   try {
//     const newCar = await car.save();
//     res.status(201).json({ newCar });
//   } catch(err) {
//     return res.status(500).json({ message: err.message });
//   }
// })

// router.delete("/cars", async (req, res) => {
//   await Car.deleteOne({_id: req.body.id}, (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: err.message });
//     }
//     else {
//         console.log(req.body.id)
//       res.status(200).json(result);
//     }
//   });
// })

// router.put("/cars/:id", async (req, res) => {
//   await Car.findOneAndUpdate({ _id: req.params.id }, req.body, {new: true}, (err, result) => {
//     if (err){
//       return res.status(500).json({ message: err.message });
//     }
//     else{
//       res.status(200).json({ result });
//     }
//   });
// })

module.exports = router;
