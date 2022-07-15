//blogRouter is a mini application created by express Router which works the same way as an app
const blogRouter = require("express").Router();
const Blog = require("../models/blogs");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

//get token
const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

//Router GET all the blogs
blogRouter.get("/", async (request, response) => {
  //use populate method to show user information rather than id
  //{} can select specific fields to include with 1 and not to include with 0
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    _id: 0,
  });
  response.json(blogs.map((blog) => blog.toJSON()));
});

//Router POST all the blogs
blogRouter.post("/", async (request, response, next) => {
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

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
    user: user._id,
  });

  try {
    //save blog in savedBlog
    const savedBlog = await blog.save();
    //also saved it to the user blogs
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    //return response
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

//Router DELETE the blog with same id
blogRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//Router PUT the blog with same id
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

  //find by id and update, if update not successful then catch an error
  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.status(201).json(updatedBlog);
    })
    .catch((error) => next(error));
});

module.exports = blogRouter;
