const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./utils/config.js");
const logger = require("./utils/logger");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");

//use CORS and express.json to transform incoming JSON into body of request
app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);

//set basic router url for blogRouter
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/login", loginRouter);

app.use(middleware.errorHandler);

module.exports = app;
