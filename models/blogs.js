const config = require("../utils/config");
const mongoose = require("mongoose");

//set blogSchema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  likes: Number,
});

//delete id and version data out of the return response body
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

//set variable Blog as a model of blogSchema
const Blog = mongoose.model("Blog", blogSchema);

//connect to the MONGODB database
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);

module.exports = Blog;
