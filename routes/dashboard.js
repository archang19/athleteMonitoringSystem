var express = require("express");
var passport = require("passport");
var router  = express.Router({mergeParams: true});
var User = require("../models/user");

router.get("/", isLoggedIn, function(req, res){
  Promise.all([
  User.find({coaches: { $in: [req.user.username] } }),
  User.find({athletes: { $in: [req.user.username] } })
  ])
  .then(results=>{
    //results return an array
    const [athletes, coaches] = results;
    console.log("athletes",athletes);
    console.log("coaches",coaches);
    console.log(req.user.username);
    res.render("auth/dashboard", {athletes: athletes, coaches: coaches, username: req.user.username}); 
  })
  .catch(err=>{
    console.error("Something went wrong",err);
  })
});

router.post("/", function(req, res) {
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;