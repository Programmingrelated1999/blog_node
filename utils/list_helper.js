const lodash = require("lodash");

//totalLikes function which takes the blogs list and return 0 when it is empty
//returns the sum of the blogs likes when the blogs list is not empty
const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

//find the maxLikes from the list of blogs and return the highest likes
const favoriteBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    let max = blogs[0];
    for (let i = 1; i < blogs.length; i++) {
      if (blogs[i].likes > max.likes) {
        max = blogs[i];
      }
    }
    return max.likes;
  }
};

//find author with highest number of blogs
const findAuthorWithMostBlogs = (blogs) => {
  //if blogs.length is 0 then return none
  if (blogs.length === 0) {
    return "None";
  }
  //else first create a list of authors blogs and set it in a variable
  //head = get first element of the array
  //last = get last element of the array
  //countby - return composed aggregate object
  //entries - key value pairs
  //
  else {
    let tagArray = blogs.map((blog) => blog.author);
    let result = lodash.head(
      lodash(tagArray).countBy().entries().maxBy(lodash.last)
    );
    return result;
  }
};

//return highest number of likes blog author
const mostLikes = (blogs) => {
  //if blogs.length is 0 then return none
  if (blogs.length === 0) {
    return "None";
  } else {
    let max = blogs[0];
    for (let i = 1; i < blogs.length; i++) {
      if (blogs[i].likes > max.likes) {
        max = blogs[i];
      }
    }
    return { author: max.author, likes: max.likes };
  }
};

module.exports = {
  totalLikes,
  favoriteBlogs,
  findAuthorWithMostBlogs,
  mostLikes,
};
