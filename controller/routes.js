var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app, db) {
  app.get("/", function(req, res) {
    res.render("index", {prompt: "Routes work successfully"})
  })

  //Scrape data using axios, parse using cheerio, send to database.
  app.get("/api/scrape", function(req, res) {
    // https://spacenews.com/segment/news/
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
            // console.log(err);
          });
        
        })
        
      }).then(() =>{ 
        console.log("done axios")
        res.json({status: true});
    });
  });

  app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        for (let i = 1; i <= dbArticle.length; i++) { dbArticle[i-1].position = i; }
        res.render("articles", {articles: dbArticle});
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("Note")
    .then(function(err, dbArticle, two) {
        if (err) throw err;
        console.log(two);
        
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        console.log(dbNote);
        
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {note: dbNote._id} }, { new: true });
      })
      .then(function(err, dbArticle) {
        console.log("============Article==============", dbArticle, "===========DbNote===========",dbNote);
        res.json(dbNote.data);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.put("/articles/:id", function(req, res) {
    res.json({error: "not implemented"})
  })

  app.get("/articles/saved")

}
