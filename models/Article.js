var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  // Title of the article
  title: {
    type: String,
    required: true,
    unique: true
  },
  //hyperlink to the article
  link: {
    type: String,
    required: true
  },
  // Many note ids per article
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }],
  //Saving specific articles to saved list
  saved: {
    type: Boolean,
    default: false
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
