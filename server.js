require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var db = require("./models");
var mysql = require("mysql")


var app = express();
var port = process.env.PORT || 8080;
var passport = require("passport");

var flash = require("express-flash");
var session = require("express-session");
var methodOverride = require("method-override");

//db connection
var database = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "sequelize_passport"
})
 database.connect(function(err) {
   if (err) {
     throw(err)
   }
   console.log("MySQL connected") 
 })
//Middleware
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(flash());

//Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

//For the logout
app.use(methodOverride("_method"));

//Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Routes
require("./routes/apiRoutes")(app, passport);
require("./routes/htmlRoutes")(app, passport);

//Passport strategies
require('./config/passport')(passport, db.user);

//Sync Database
db.sequelize.sync().then(function() {
  console.log('Nice! Database looks fine')
}).catch(function(err) {
  console.log(err, "Something went wrong with the Database Update!")
});

app.listen(port, function(err){
  if(err) {
    console.log(err)
  } else {
    console.log('Server is live')
  }
})