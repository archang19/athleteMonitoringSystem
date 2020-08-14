var express = require('express');
var passport = require("passport");
var router = express.Router();
var User = require("../models/user");
var Log = require("../models/log");

router.post("/", function(req, res) {
	User.findOne({username: req.user.username}, function(err, usr) {
		if (err) {
			console.log(err);
			res.redirect("/");
		}
		else {
      var desc = [];
      var curDesc = "";
      for (var k = 0; k < req.body.log.length; k++) {
        if (req.body.log[k] == '\n' || req.body.log[k] == '\r') {
          desc.push(curDesc);
          curDesc = "";
        }
        else {
          curDesc += req.body.log[k];
        }
      }
      desc.push(curDesc);

			Log.create({description: desc, name: req.body.name, completed: req.body.completed}, function (err, l) {
				if (err) {
					console.log(err);
				}
				else {
					l.author= req.user.username;
          l.created = new Date().toISOString();
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

router.get("/:usrname", isLoggedIn, function(req, res){
	console.log(req.params.usrname);
	Log.find({author: req.params.usrname}, null, {sort: {created: -1}}, function(err, l) {
		if (err) {
			console.log(err);
		}
		else {
      console.log(l);
			res.render("log", {log: l, username: req.params.usrname} );
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
        var desc = [];
        console.log(l);
        var curDesc = "";
        console.log(req.body.log);
        for (var k = 0; k < req.body.log.length; k++) {
          if (req.body.log[k] == '\n' || req.body.log[k] == '\r') {
            desc.push(curDesc);
            curDesc = "";
          }
          else {
            curDesc += req.body.log[k];
          }
        }
        desc.push(curDesc);
        l.name = req.body.name;
        l.description = desc;
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