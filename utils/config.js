// Description: This file contains the configuration for the server
require("dotenv").config();

const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST;

//process.env.user returns the default user for the system, so we must use DB_USER instead of USER
const USER = process.env.DB_USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

module.exports = {
  PORT,
  USER,
  HOST,
  PASSWORD,
  DATABASE,
};
