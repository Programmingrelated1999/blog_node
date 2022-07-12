const app = require("./app"); // the actual Express application
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");

//create a server with http.createServer which takes in the already created server app
const server = http.createServer(app);

//listen to port and log the status
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
