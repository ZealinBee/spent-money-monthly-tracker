// index.js
const express = require('express');
const bodyParser = require('body-parser');
const query = require('./db/ass');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const port = 3000;

app.get('/z', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'))
});

app.get('/daysCount.js', function(req, res){
  res.sendFile(path.join(__dirname + '/daysCount.js'))
});

app.get('/style.css', function(req, res){
  res.sendFile(path.join(__dirname + '/style.css'))
});


app.get('/script.js', function(req, res){
  res.sendFile(path.join(__dirname + '/script.js'))
});


app.get('/main.css', function(req, res){
  res.sendFile(path.join(__dirname + '/main.css'))
});

app.get('/main.js', function(req, res){
  res.sendFile(path.join(__dirname + '/main.js'))
});


app.get("/api/movies", query.getAllMovies);
app.get("/api/movies/:id", query.getMovieById);
app.post("/api/movies", query.addMovie);
app.delete("/api/movies/:id", query.deleteMovie);
app.put("/api/movies/:id", query.updateMovie);

app.listen(port, () => {{}
  console.log(`Server is running on port ${port}.`);
});