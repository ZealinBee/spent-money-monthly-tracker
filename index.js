const express = require('express');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const routes = require("./routes")
require('dotenv').config();

const app = express();
app.use(express.static('public'));


app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    `script-src 'self' ${process.env.BASE_URL}`
  );
  next();
});
//Delete later
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(bodyParser.json());
app.use(helmet());

app.use('/', routes);



//MongoDB connection
const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true)
const mongoURL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.q7wn3ji.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;
mongoose.connect(mongoURL, { useFindAndModify: false, useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const port = process.env.PORT || 3000;;

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});