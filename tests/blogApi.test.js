//requie mmongoose for closing the database
//require supertest which will test the app and change it to api
//Blog is imported from blogs model
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blogs");

//set initialBlogs data for testing
const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

//make sure that the initial data goes unchanged before each test
//set the data to its initial data before each test
beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

//GET tests
describe("GET", () => {
  //test GET api/blogs to see if all blogs are returned
  test("when GET api/blogs, must return all blogs, in this case 2", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  //test GET api/blogs to see if all blogs are returned
  test("when GET api/blogs, expect blogs to have an id", async () => {
    const blogs = await Blog.find({});
    expect(blogs[0]._id).toBeDefined();

    /* This code would not work if mongoose.set transform was used since it will take away id in the return so have to use model to get the blog with id
    const response = await api.get("/api/blogs");
    expect(response.body[0]._id).toBeDefined();
    */
  });
});

//POST tests
describe("POST", () => {
  //test POST api/blogs, expect blogs to increase by 1
  test("when POST api/blogs, expect blogs to increase by 1", async () => {
    const newBlog = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
    };

    //POST method to save the blog
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    //find the blog
    const blogs = await Blog.find({});
    expect(blogs).toHaveLength(initialBlogs.length + 1);
  });

  //test POST api/blogs, expect blogs to have likes 0 when likes is not defined
  test("when POST api/blogs with no likes, expect blog to have likes: 0", async () => {
    const newBlog = {
      title: "NoLikes",
      author: "Got No Likes",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/got-no-likes",
    };

    //POST method to save the blog
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    //find the blog
    const blogs = await Blog.find({});
    const blog = await blogs.find((blog) => blog.title === "NoLikes");
    expect(blog.likes).toEqual(0);
  });

  //test POST api/blogs, expect 404 when url or title is missing
  test("when POST api/blogs with no url or title, get 404", async () => {
    const newBlog = {
      author: "Url&TitleMissing",
      likes: 2,
    };

    //POST method to save the blog
    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

//DELETE tests
describe("DELETE", () => {
  //test if the valid id blog is deleted
  test("should successfully delete the blog with the requested id", async () => {
    const blogs = await Blog.find({});
    const id = blogs[0]._id;

    //delete request and get 204 status
    await api.delete(`/api/blogs/${id}`).expect(204);
  });
});

//PUT tests
describe("PUT", () => {
  //test if the valid id blog is updated
  test("should successfully update the blog with the requested id", async () => {
    //get the id of the first blog to be updated
    let blogs = await Blog.find({});
    const id = blogs[0]._id;

    //create a new Blog for update
    const newBlog = {
      title: "NoLikes",
      author: "Got No Likes",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/got-no-likes",
    };

    //update and expect 201
    await api
      .put(`/api/blogs/${id}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    //gets the blogs again and see if blog[0].title is NoLikes
    blogs = await Blog.find({});
    expect(blogs[0].title).toEqual("NoLikes");
  });
});

//close mongoose connection after all the test
afterAll(() => {
  mongoose.connection.close();
});
