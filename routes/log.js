var express = require('express');
var passport = require("passport");
var router = express.Router();
var User = require("../models/user");
var Log = require("../models/log");
var csv = require('jquery-csv');

router.post("/", function(req, res) {
	User.findOne({username: req.user.username}, function(err, usr) {
		if (err) {
			console.log(err);
			res.redirect("/");
		}
		else {
			Log.create({description: req.body.notes, details: req.body.details, name: req.body.name, completed: req.body.completed}, function (err, l) {
				if (err) {
					console.log(err);
				}
				else {
					l.author= req.user.username;
          l.created = new Date().toISOString();
          l.tabularDetails = csv.toArrays(l.details);
					l.save();
					console.log(l);
					console.log(usr);
					usr.log.push(l);
					usr.save();
					console.log(usr);
					res.redirect("/dashboard");
				}
			});
		}
	});
});

router.post("/setSheet/:username", isLoggedIn, function(req, res) {
  console.log(req.body.sheet);
  User.findOne({username: req.params.username}, function (err, u) {
    if (err) {
      console.log(err);
    }
    else {
      u.sheet = req.body.sheet;
      u.setSheet = true;
      u.save();
      console.log(u);
      res.redirect("/log/" + req.params.username);
    }

  });
});

router.get("/:usrname", isLoggedIn, function(req, res){
	console.log(req.params.usrname);
	Log.find({author: req.params.usrname}, null, {sort: {created: -1}}, function(err, l) {
		if (err) {
			console.log(err);
		}
		else {
      console.log(l);
      var tmp = req.params.usrname;
      User.findOne({username: tmp}, function (err, s){
        if (err) {
          console.log(err);
        }
        else {
          console.log("Success???");
          res.render("log", {log: l, username: req.params.usrname, user: s} );
        }
      });
		}
	});    
});

router.get("/:usrname/updateLog/:id", isLoggedIn, function(req, res){
    console.log("GET");
    console.log(req.params.id);

    Log.findById(req.params.id, function(err, l) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("CSV To Array? ")
        console.log(l.description);
        console.log(csv.toArrays(l.description[0]))
        res.render("log/updateLog", {log: l});
      }
    });    
});

router.post("/:usrname/updateLog/:id", isLoggedIn, function(req, res) {
    console.log("PATCH");
    console.log(req.params.id);
    Log.findById(req.params.id, function(err, l) {
      if (err) {
        console.log(err);
      }
      else {
        l.details = req.body.details;
        l.description = req.body.description;
        l.tabularDetails = csv.toArrays(l.details);

        l.save();
        console.log(l);
        res.redirect("/log/" + l.author);
      }
    }); 
});

router.post("/:usrname/deleteLog/:id", isLoggedIn, function(req, res) {
    console.log("DELETE");
    console.log(req.params.id);
    Log.findById(req.params.id, function(err, l) {
      if (err) {
        console.log(err);
      }
      else {
        var a = l.author;
        l.remove(err => {
          if (err) {
            console.log(err);
          }
          else {
            res.redirect("/log/" + a);
          }
        })
        
      }
    }); 
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;