// Description: This file contains the configuration for the server
require("dotenv").config();

const PORT = process.env.PORT || 3002;

const USER = process.env.USER;
const HOST = process.env.HOST;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

module.exports = {
  PORT,
  USER,
  HOST,
  PASSWORD,
  DATABASE,
};
