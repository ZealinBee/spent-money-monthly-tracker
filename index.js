const express = require('express');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const routes = require("./routes")
require('dotenv').config();

const app = express();
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


const port = process.env.PORT || 5000;;

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});