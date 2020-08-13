var express = require('express');
var passport = require("passport");
var router = express.Router();
var User = require("../models/user");
var Log = require("../models/log");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get("/register", function(req, res){
   res.render("auth/register"); 
});

router.post("/register", function(req, res){
    var isCoach = false;
    User.register(new User({username: req.body.username, 
      firstName: req.body.firstName, 
      lastName: req.body.lastName,}), req.body.password, function(err, user){
        if(err){
            console.log(err);
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/");
        });
    });
});

router.get("/login", function(req, res){
   res.render("auth/login"); 
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
}) ,function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

router.get("/dashboard", isLoggedIn, function(req, res){
  Promise.all([
  User.find({coaches: { $in: [req.user.username] } }),
  User.find({athletes: { $in: [req.user.username] } })
  ])
  .then(results=>{
    //results return an array

    const [athletes, coaches] = results;

    console.log("athletes",athletes);
    console.log("coaches",coaches);
    res.render("auth/dashboard", {athletes: athletes, coaches: coaches}); 
  })
  .catch(err=>{
    console.error("Something went wrong",err);
  })
});

router.post("/dashboard", function(req, res) {
  console.log(req.body.athleteUsername);
  User.find({username:req.body.athleteUsername}, function(err, athlete) {
    if (err) {
      console.log(err);
    }
    else {
         User.updateOne({username: req.user.username}, 
          {$addToSet: {athletes: req.body.athleteUsername}},
          function(err2, success) {
            if (err2) {
              console.log(err2);
            }
            else {
              console.log(success);
            }
        });
          User.updateOne({username: req.body.athleteUsername}, 
          {$addToSet: {coaches: req.user.username} },
          function(err3, success2) {
            if (err3) {
              console.log(err3);
            }
            else {
              console.log(success2);
              res.redirect("/dashboard");
            }
        });
    }
});
});


router.post("/log", function(req, res) {
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

			Log.create({description: desc}, function (err, l) {
				if (err) {
					console.log(err);
				}
				else {
					l.author= req.user.username;
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


router.get("/log/:usrname", function(req, res){
	console.log(req.params.usrname);
	Log.find({author: req.user.username}, function(err, l) {
		if (err) {
			console.log(err);
		}
		else {
      console.log(l);
			res.render("log", {log: l} );
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
