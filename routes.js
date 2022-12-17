const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('./models/user');

router.post("/register", async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        totalHave: req.body.totalHave,
        totalSpend:req.body.totalSpend
      })
  try {
        const newUser = await user.save();
        res.status(201).json({ newUser });
      } catch(err) {
        return res.status(500).json({ message: err.message });
      }
})



router.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

router.get("/daysCount.js", async (req, res) => {
    res.sendFile(path.join(__dirname + '/daysCount.js'))
})

router.get("/index.js", async (req, res) => {
    res.sendFile(path.join(__dirname + '/index.js'))
})

router.get("/main.js", async (req, res) => {
    res.sendFile(path.join(__dirname + '/main.js'))
})

router.get("/main.css", async (req, res) => {
    res.sendFile(path.join(__dirname + '/main.css'))
})

router.get("/style.css", async (req, res) => {
    res.sendFile(path.join(__dirname + '/style.css'))
})

router.get("/script.js", async (req, res) => {
    res.sendFile(path.join(__dirname + '/script.js'))
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