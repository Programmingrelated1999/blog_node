const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/users");

//loginRouter
loginRouter.post("/", async (request, response) => {
  //get username, and password from the request body
  const { username, password } = request.body;

  //find user with the same username and then set password to true/false base on if the password matches
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  //if no user or password does not match, show error message
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  //create user token with username and id
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  //set token with jwt sign
  const token = jwt.sign(userForToken, process.env.SECRET);

  //send back username, token and the name of the user
  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
