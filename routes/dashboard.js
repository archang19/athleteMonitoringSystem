var express = require("express");
var passport = require("passport");
var router  = express.Router({mergeParams: true});
var User = require("../models/user");
var Connection = require("../models/connection");

router.get("/", isLoggedIn, function(req, res){
  Promise.all([
  User.find({coaches: { $in: [req.user.username] } }),
  User.find({athletes: { $in: [req.user.username] } }),
  Connection.find({athlete: req.user.username})
  ])
  .then(results=>{
    //results return an array
    const [athletes, coaches, coachRequests] = results;
    console.log("athletes",athletes);
    console.log("coaches",coaches);
    console.log(req.user.username);
    res.render("auth/dashboard", {athletes: athletes, coaches: coaches, coachRequests: coachRequests, username: req.user.username}); 
  })
  .catch(err=>{
    console.error("Something went wrong",err);
  })
});

router.post("/confirmCoach/:username", function(req, res) {
  console.log(req.params.username);
  User.updateOne({username: req.params.username}, 
	  {$addToSet: {athletes: req.user.username}},
	  function(err2, success) {
	    if (err2) {
	      console.log(err2);
	    }
	    else {
	      console.log(success); 
	    }
	});
  User.updateOne({username: req.user.username}, 
	  {$addToSet: {coaches: req.params.username} },
	  function(err3, success2) {
	    if (err3) {
	      console.log(err3);
	    }
	    else {
	      console.log(success2);
	      // res.redirect("/dashboard");
	    }
	});
  Connection.remove({coach: req.params.username, athlete: req.user.username}, function(err, c) {
  	if (err) {
  		console.log(err);
  	}
  	else {
  		res.redirect("/dashboard");
  	}
  });
});


router.post("/requestAthlete", function(req, res) {
  console.log(req.body.athleteUsername);
  console.log(req.user.username);

  Connection.create({coach: req.user.username, athlete: req.body.athleteUsername}, function(err, c) {
  	if (err) {
  		console.log(err);
  	}
  	else {
  		res.redirect("/dashboard");
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