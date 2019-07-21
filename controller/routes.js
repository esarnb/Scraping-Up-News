var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app, db) {
  app.get("/", function(req, res) {
    res.render("index", {prompt: "Routes work successfully"})
  })

  //Scrape data using axios, parse using cheerio, send to database.
  app.get("/api/scrape", function(req, res) {
    db.Article.remove({});
    axios.get("http://www.echojs.com/").then(function(response) {
      var $ = cheerio.load(response.data);

      $("article h2").each(function() {
        var result = {};

        result.title = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");

        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      res.redirect("/articles");
    });
  });

  app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.render("articles", {articles: dbArticle});
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}