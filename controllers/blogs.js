//blogRouter is a mini application created by express Router which works the same way as an app
const blogRouter = require("express").Router();
const Blog = require("../models/blogs");

//Router GET all the blogs
blogRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

//Router POST all the blogs
blogRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  //save the blog and return json of the saved object with status 201
  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = blogRouter;
