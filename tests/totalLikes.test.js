const listHelper = require("../utils/list_helper");

//describe the data for the testing
const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

//describe the total likes test
//first declare the blogs
describe("total likes", () => {
  //test when there is empty blogs, equal 0
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  //test when there is only one blog, equals the likes of that
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes([blogs[1]]);
    expect(result).toBe(5);
  });

  //test when there are many blogs, the total likes is the sum of the blogs.likes
  test("when list has many blogs, equals the likes of total", () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(
      blogs[0].likes +
        blogs[1].likes +
        blogs[2].likes +
        blogs[3].likes +
        blogs[4].likes +
        blogs[5].likes
    );
  });
});

//find the favorite likes
describe("favorite likes", () => {
  //test when there is empty blogs, equal 0
  test("when list is empty, return {}", () => {
    const result = listHelper.favoriteBlogs([]);
    expect(result).toEqual({});
  });

  //test when there is one blog, return one blog
  test("when list has only one blog, favorite is the blog", () => {
    const blog = blogs[0];
    const maxLikes = listHelper.favoriteBlogs([blog]);
    const favoriteBlog = blogs.find((blog) => blog.likes === maxLikes);
    expect(favoriteBlog).toEqual(blog);
  });

  //test when there are many blogs, return blog with highest likes
  test("when list of blogs, return highest likes blog", () => {
    //maxlikes only return the highest likes
    const maxLikes = listHelper.favoriteBlogs(blogs);
    //favorite blog is set to the blog with the same number of maxlikes
    const favoriteBlog = blogs.find((blog) => blog.likes === maxLikes);
    //favorite blog is compared to the blog with the highest likes
    expect(favoriteBlog).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    });
  });
});

//find the author with the most blogs
describe("author with most blogs", () => {
  //Return None when the list is empty
  test("when list is empty, return None", () => {
    const result = listHelper.findAuthorWithMostBlogs([]);
    expect(result).toEqual("None");
  });

  //list has one blog, return author's name
  test("when there is only one author in the list, return the author's name", () => {
    const result = listHelper.findAuthorWithMostBlogs([blogs[0]]);
    expect(result).toEqual("Michael Chan");
  });

  //list has many blogs, return most common author's name
  test("when there is a list of blogs, return author's name with the highest number of blogs", () => {
    const result = listHelper.findAuthorWithMostBlogs(blogs);
    expect(result).toEqual("Robert C. Martin");
  });
});

//find the author who worte the highest liked blog
describe("author who wrote the highest liked blog", () => {
  //Return None when the list is empty
  test("when list is empty, return None", () => {
    const result = listHelper.mostLikes([]);
    expect(result).toEqual("None");
  });

  //list has one blog, return author's name
  test("when there is only one author in the list, return the author's name and likes", () => {
    const result = listHelper.mostLikes([blogs[0]]);
    const author = blogs[0].author;
    const likes = blogs[0].likes;
    expect(result).toEqual({ author: author, likes });
  });

  //list has many blogs, return the author who wrote the blog with highest number of likes
  test("when there is a list of blogs, highest liked blogs' author and likes as an object", () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 12 });
  });
});
