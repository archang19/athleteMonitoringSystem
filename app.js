var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var passport = require("passport");
var LocalStrategy = require("passport-local");

var User = require("./models/user");
var Slot = require("./models/slot");
var Workout = require("./models/workout");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require("express-session")({
    secret: "ucb",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get("/register", function(req, res){
   res.render("auth/register"); 
});

app.get("/dashboard", isLoggedIn, function(req, res){


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

   // User.find({coaches: { $in: [req.user.username] } } , function(err, athletes) {
   //    console.log(athletes);
   //    res.render("auth/dashboard", {athletes: athletes}); 
   // });
});

app.post("/dashboard", function(req, res) {
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

app.post("/register", function(req, res){
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

app.get("/login", function(req, res){
   res.render("auth/login"); 
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = app;
