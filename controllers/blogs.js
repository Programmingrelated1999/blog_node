//blogRouter is a mini application created by express Router which works the same way as an app
const blogRouter = require("express").Router();
const Blog = require("../models/blogs");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

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
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
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
blogRouter.delete("/:id", async (request, response, next) => {
  //verify if the token is correct then store it in decoded token,
  //if not correct return error message
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  //find user with the same id as a decoded token
  const user = await User.findById(decodedToken.id);
  //get blog which has the same id from url
  const blogToDelete = await Blog.findById(request.params.id);

  //if blog to delete user id and the token user id are the same then remove the blog
  //else return error message
  if (blogToDelete.user.toString() === user._id.toString()) {
    try {
      //save blog in savedBlog
      await Blog.findByIdAndRemove(request.params.id);
      //return response
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  } else {
    return response.status(401).json({ error: `Unauthorized` });
  }
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
