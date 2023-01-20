//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const e = require("express");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://admin-arman:ram123arm123@cluster0.irhztwk.mongodb.net/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true })

const itemsSchema = ({
  name: String
})

const Item = mongoose.model("Item", itemsSchema);

const gym = new Item ({
  name: "Gym"
})

const code = new Item ({
  name: "coding"
})

const shower = new Item ({
  name: "Shower"
})

const defaultItems = [gym, code, shower]

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);




app.get("/", function(req, res) {

  Item.find({}, function(err, foundItem){
    if(foundItem.length===0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err)
        } else{
          console.log("lets goo")
        }
        
      })
      res.redirect("/")
    } else{
        res.render("list", {listTitle: "Today", newListItems: foundItem});
    }
  })
});

app.get('/:customList', function(req, res){
  const customList = _.capitalize(req.params.customList);

  List.findOne({name: customList}, function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List ({
          name: customList,
          items: defaultItems
        })
        list.save()
        res.redirect("/" + customList)
      }
      else{
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
      }

    }
  
  })

  

})



app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  })

  if(listName === "Today"){
    item.save()
    res.redirect("/")
  }
  else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item)
      foundList.save()
      res.redirect("/" + listName)
    })
  }

  

});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){

    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log("deleted")
        res.redirect("/")
      }
    })
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName)
      }
    })
  }
})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
