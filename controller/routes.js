var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app, db) {
  app.get("/", function(req, res) {
    res.render("index", {prompt: "Routes work successfully"})
  })
}