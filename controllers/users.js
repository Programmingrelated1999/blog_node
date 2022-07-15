const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");

//router POST all the users
userRouter.post("/", async (request, response, next) => {
  const body = request.body;

  //if password length is less than 3 then return error
  if (body.password.length < 3) {
    return response.status(400).json({
      error: `User validation failed: username: Path password is shorter than the minimum allowed length (3)`,
    });
  }

  //saltRounds set to 10 and use bcrypt to transform password into passwordHash
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  //create user
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  try {
    //save User in the user
    const savedUser = await user.save();
    //return response
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

//router GET all the users
userRouter.get("/", async (request, response) => {
  const userList = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    _id: 0,
  });
  response.status(200).json(userList);
});

module.exports = userRouter;
