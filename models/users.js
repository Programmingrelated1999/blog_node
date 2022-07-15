const config = require("../utils/config");
const mongoose = require("mongoose");

//create a userSchema that includes blogs as a reference
//will shows blogs - [124751236] -> this gets later fixed in the get method in routers
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

//set the return JSON to not include version, id, and password Hash
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.passwordHash;
  },
});

//create a user from the model
const User = mongoose.model("User", userSchema);

//exports
module.exports = User;
