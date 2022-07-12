const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./utils/config.js");
const logger = require("./utils/logger");
const { builtinModules } = require("module");
const Blog = require("./models/blogs");

//use CORS and express.json to transform incoming JSON into body of request
app.use(cors());
app.use(express.json());

//Router GET all the blogs
app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

//Router POST all the blogs
app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  //save the blog and return json of the saved object with status 201
  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = app;
