const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./utils/config.js");
const logger = require("./utils/logger");
const { builtinModules } = require("module");
const Blog = require("./models/blogs");
const blogRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");

//use CORS and express.json to transform incoming JSON into body of request
app.use(cors());
app.use(express.json());

//set basic router url for blogRouter
app.use("/api/blogs", blogRouter);

app.use(middleware.errorHandler);

module.exports = app;
