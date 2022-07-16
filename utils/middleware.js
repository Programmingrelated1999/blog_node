const logger = require("./logger");

//error handler
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  //based on the type of error send an error
  //mongoservererror is when the username is unique and cannot be send another time
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError") {
    return response.status(500).json({ error: "Username already exists" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  }

  //if there is an error log the error
  logger.error(error.message);
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }
  next();
};

module.exports = { errorHandler, tokenExtractor };
