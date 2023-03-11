const mysql = require("mysql2/promise");
const config = require("../utils/config");

const pool = mysql.createPool({
  //NOTE: for some reason "config.USER" doesn't work, but "username" does
  host: config.HOST,
  user: "b213fd8763cda3",
  password: config.PASSWORD,
  database: config.DATABASE,
});

// const pool = mysql.createPool({
//   //NOTE: for some reason "config.USER" doesn't work, but "root" does
//   user: "b213fd8763cda3",
//   host: "eu-cdbr-west-03.cleardb.net",
//   password: "1b87bbcb",
//   database: "heroku_ea7c6fe510f02a6",
// });

module.exports = pool;
