var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app, db) {

  app.get("/", function(req, res) {
    res.render("index")
  })

  //Scrape data using axios, parse using cheerio, send to database.
  app.get("/api/scrape", function(req, res) {
    // https://spacenews.com/segment/news/
    // http://www.echojs.com/
    axios.get("http://www.echojs.com/").then(function(response) {
      var $ = cheerio.load(response.data);
      //.launch-article
      var result = {};
      $("article h2").each(function() {

        result.title = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");

        db.Article.create(result).then(function(dbArticle) {
            //Articles being created sent to server console.
            console.log(dbArticle);
          })
          .catch(function(err) {
            /* Any create errors (including duplicate entries) */
            // console.log(err);
          });
        })
      }).then(() =>{ 
        // Return true when axios is done scraping
        res.json({status: true});
    });
  });

  //Display all articles 
  app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        //Number all articles and then render them to the page
        res.render("articles", {articles: dbArticle});
      })
      .catch(function(err) {
        console.log(err);
      });
  });
  
  //Display all articles 
  app.get("/articles/saved", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.render("saved", {articles: dbArticle});
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  //Populate a specific article's notes and return them
  app.get("/articles/:id/notes", function(req,res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("notes")
    .then(function (data) {
      res.json(data);
    });        
  });

  //Create a new note
  app.post("/articles/:id/notes/new", function(req, res) {
    db.Note.create(req.body).then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {notes: dbNote._id} }, { new: true });
      })
      .then(() => {
        res.json(dbNote.data);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  //Updating articles between saved and unsaved
  app.put("/articles/:id", function(req, res) {
    //Reverse the current state of the article being (un)saved.
    db.Article.findOne({_id: req.params.id}).then((record) => {
      db.Article.updateOne({_id: req.params.id}, {saved: !record.saved}).then((records) => {
        res.redirect("/articles");
      }) 
    })
  })


  app.delete(`/articles/:articleID/notes/:noteID`, function(req, res) {
    // var articleID = req.params.articleID;
    var noteID = req.params.noteID;

    db.Note.deleteOne({_id: noteID}).then((result) => res.json(result))
  })

}
