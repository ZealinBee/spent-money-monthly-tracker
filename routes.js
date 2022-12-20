const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const crypt = require("./cryptography");
const auth=require("./service/authorization")
const router = express.Router();

router.post("/register", async (req, res) => {
  let user;
    crypt.cryptPassword(req.body.password)
      .then((hash) => {
        user = new User({
          username: req.body.username,
          password: hash,
          totalHave: 0,
          totalSpend: 0,
        });
        token = jwt.sign({userId: req.body.username, totalHave:0,totalSpend:0}, process.env.SECRET_KEY);
        return user;
      })
      .then(async () => {
        try {
          await user.save();
          return res.status(201).json({ message: true,token:token });
        } catch (err) {
          if (err.code==11000)
            return res.status(500).json({ message: false });
          return res.status(500).json({ message: err.message });
        }
      });
  })

router.post("/login", async (req, res) => {
  try {
    let user = User.find({ username: req.body.username });
    let hashword='';
    let totalHave = 0;
    let totalSpend = 0;
    let answer = false;
    let token = '0'
    for await (const doc of user) {
      hashword = doc.password;
      totalHaveUser = doc.totalHave;
      totalSpendUser = doc.totalSpend;
      username=req.body.username
      break;
    }
    if (bcrypt.compareSync(req.body.password, hashword)) {
      answer = true;
      totalHave = totalHaveUser;
      totalSpend = totalSpendUser;
      token = jwt.sign({userId: username, totalHave:totalHave,totalSpend:totalSpend}, process.env.SECRET_KEY);
    }
    return res.status(200).json({
      answer: answer,
      totalSpend: totalSpend,
      totalHave: totalHave,
      token:token
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

router.put("/money", async (req, res) => {
  auth.auth(req).then(async (result)=>{
    if (!result)
    return res.status(400).json({message:"Bad request"})
    await User.findOneAndUpdate(
      { username: result.userId },
      req.body,
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        } else {
          res.status(200).json({ result:result});
        }
      }
    );
  })
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
    }
    else {
      res.status(200).json({result:"Done"});
    }
  });
})

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
