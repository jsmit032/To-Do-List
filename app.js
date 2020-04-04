//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
  name: "Welcome to your todolist!"
});

const item2 = new Item ({
  name: "Hit the + button to add a new item."
});

const item3 = new Item ({
  name: "<-- Hit this button to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){
  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully saved default items to DB!");
        }
      });
      res.redirect("/");
    } else {
      res.render('list', {listTitle: "Today", newListItems: foundItems});
    }
  });
});

// create dynamic route to create a whole new list page
// by typing in a new url address

app.get('/:listName', function(req, res){
  const requestedName = _.lowerCase(req.params.listName);

  List.findOne({ name: requestedName }, function(err, foundList){
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: requestedName,
          items: defaultItems
        });

        list.save(function(err){
          if (err) {
            console.log(err);
          }
        });
        res.redirect("/" + requestedName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });

  // List.find({}, function(err, foundLists){
  //   foundLists.forEach(function(list){
  //     const listName = _.lowerCase(list.name);
  //     if (requestedName == listName) {
  //       console.log("It's a Match!");
  //       res.render("list", {
  //         listTitle: list.name,
  //         newListItems: list.items
  //       });
  //       return;
  //     }
  //   });
  // }); // end List.find()

});

app.post("/", function(req, res){
  const itemName = req.body.newItem;

  var newItem = new Item({ name: itemName });
  newItem.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, {useFindAndModify: false}, function(err){
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });

});

app.get('/about', function(req, res){
  res.render("about");
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
