//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

const buyFood = new Item ({
  name: "Buy Food"
});

const cookFood = new Item ({
  name: "Cook Food"
});

const eatFood = new Item ({
  name: "Eat Food"
});

Item.insertMany([buyFood, cookFood, eatFood], function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("Succesfully logged all the list items!");
  }
});

app.get("/", function(req, res){
  res.render('list', {listTitle: "Today", newListItems: items});
});

app.post("/", function(req, res){
  const item = req.body.newItem;

  if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get('/work', function(req, res){
  res.render('list', {listTitle: "Work List", newListItems: workItems});
});

app.get('/about', function(req, res){
  res.render("about");
});
