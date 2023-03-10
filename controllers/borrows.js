const Item = require("../models/item");
const Image = require("../models/item");

module.exports = {
    index,
    show,
    allItems, 
    new: newItem,
    create,
    deleteItem, 
    edit,
    update,
    addBorrowed
};

function index(req, res) {
    Item.find({}, function (err, items) {
        res.render('items/index', { title: 'Item Inventory List', items })
    })
}

function show(req, res) {
    Item.findById(req.params.id, function(err, item) {
      res.render('items/show', { title: 'Item Detail', item });
    });
  }

function allItems(req, res) {
    let itemQuery = req.query.name ? {name: new RegExp(req.query.name, 'i')} : {};
    Item.find(itemQuery, function(err, items) {
      // Why not reuse the books/index template?
      res.render('items/index', {
        items,
        user: req.user,  // should use middleware instead (see below)
        nameSearch: req.query.name  // use to set content of search form
      });
    });
  }

function newItem(req, res) {
    res.render("items/new", { title: "Add Item" });
};

function create(req, res) {
    const item = new Item(req.body);
    for (let key in req.body) {
        if (req.body[key] === "") delete req.body[key];
    }
        item.userAdding = req.user._id;
    item.save(function(err) {
        if (err) return res.redirect("items/new");
        res.redirect(`/items/${item._id}`);
    });
}

function deleteItem(req, res) {
    Item.findOneAndDelete(
        {_id: req.params.id, userAdding: req.user._id}, function(err) {
            res.redirect("/items");
        }
    );
}

function edit(req, res) {
    Item.findOne({_id: req.params.id, userAdding: req.user._id}, function(err,item) {
        if (err || !item) return res.redirect("/items");
        res.render("items/edit", {item});
    })
}

function update(req, res) {
    Item.findOneAndUpdate(
        {_is: req.params.id, userAdding: req.user._id},
        req.body, {new: true},
        function(err, item) {
            if (err || !item) return res.redirect("/items");
            res.redirect("item._id");
        }
    );
}

function addBorrowed(req, res) {
    Item.findById(req.params.id, function(err, book) {
      // Ensure that user is not already in usersReading
      // See "Finding a Subdocument" in https://mongoosejs.com/docs/subdocs.html
      if (item.usersBorrowing.id(req.user._id)) return res.redirect('/items');
      item.usersBorrowing.push(req.user._id);
      item.save(function(err) {
        res.redirect(`/items/${item._id}`);
      });
    });
  }
  