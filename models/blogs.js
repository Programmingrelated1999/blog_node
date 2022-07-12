const config = require("../utils/config");
const mongoose = require("mongoose");

//set blogSchema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

//delete id and version data out of the return schema
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

//set variable Blog as a model of blogSchema
const Blog = mongoose.model("Blog", blogSchema);

//connect to the MONGODB database
mongoose.connect(config.MONGODB_URI);

module.exports = Blog;
