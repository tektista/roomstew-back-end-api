// Description: This file contains the configuration for the server
require("dotenv").config();

const PORT = process.env.PORT || 3001;

module.exports = {
  PORT,
};
