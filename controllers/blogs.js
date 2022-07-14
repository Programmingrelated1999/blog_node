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
blogRouter.post("/", (request, response, next) => {
  //set body to request body
  let body = request.body;
  //if there is no likes put likes: 0 in the body
  if (!body.likes) {
    body = { ...body, likes: 0 };
  }

  //create a new blog
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  //save the blog and return json of the saved object with status 201
  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
});

//Router DELETE the blog with same id
blogRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

blogRouter.put("/:id", (request, response, next) => {
  //set body to request body
  let body = request.body;
  //if there is no likes put likes: 0 in the body
  if (!body.likes) {
    body = { ...body, likes: 0 };
  }

  //create a new blog
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.status(201).json(updatedBlog);
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;
