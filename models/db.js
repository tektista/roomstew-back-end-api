const mysql = require("mysql2/promise");
const config = require("../utils/config");

const pool = mysql.createPool({
  //NOTE: for some reason "config.USER" doesn't work, but "root" does
  user: "root",
  host: config.HOST,
  password: config.PASSWORD,
  database: config.DATABASE,
});

module.exports = pool;
