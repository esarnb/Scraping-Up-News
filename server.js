//Packages
var path = require("path");
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

//Express initialization
var app = express();
var PORT = process.env.PORT || 3000;

//Models Reference
var db = require("./models");

//Express middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//Handlebars initialization
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Mongo remote/local initialization
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(() => console.log("Connected to db")).catch((err) => console.log(err));

//Import routes
require("./controller/routes.js")(app, db)

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
