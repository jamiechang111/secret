//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
//const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const app = express();

console.log(process.env.SECRECT);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extened: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});



const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRECT, excludeFromEncryption: ['email']});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if(foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});


app.listen(3000, function() {
  console.log("Server had started on port 3000.");
});
