//requie mmongoose for closing the database
//require supertest which will test the app and change it to api
//User is imported from users model
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blogs");
const api = supertest(app);
const User = require("../models/users");
const bcrypt = require("bcrypt");

//set initialBlogs data for testing
const initialUsers = [
  {
    username: "Johnny",
    name: "Johnny Lin",
  },
  {
    username: "Kevin",
    name: "Johnny Lin",
  },
];

//create a user database
beforeEach(async () => {
  await User.deleteMany({});
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash("1456468797", 10);
  initialUsers[0].passwordHash = passwordHash;
  initialUsers[1].passwordHash = passwordHash;
  user = new User(initialUsers[0]);
  await user.save();
  user = new User(initialUsers[1]);
  await user.save();
});

//GET tests
describe("GET", () => {
  //test GET api/blogs to see if all users are returned
  test("when GET api/users, must return all users, in this case 2", async () => {
    const response = await api.get("/api/users");
    expect(response.body).toHaveLength(initialUsers.length);
  });

  //test GET api/blogs to see if user has a valid id
  test("when GET api/users, expect users to have an id", async () => {
    const users = await Blog.find({});
    expect(users[0]._id).toBeDefined();
  });
});

//POST tests
describe("POST", () => {
  //test POST api/blogs, expect blogs to increase by 1
  test("when POST api/users, users increase by 1", async () => {
    const newUser = {
      username: "root",
      name: "root",
      password: "password",
    };

    //POST method to save the us
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    //find the blog
    const users = await User.find({});
    expect(users).toHaveLength(initialUsers.length + 1);
  });

  //test POST api/users to check if invalid user cannot be added
  test("when POST api/users with invalid user, get a 404 code", async () => {
    const invalidUser = {
      username: "1",
      name: "1",
      password: "password",
    };

    //POST method to save the blog
    await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});
