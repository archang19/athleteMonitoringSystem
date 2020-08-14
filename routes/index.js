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



module.exports = router;
