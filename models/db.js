const mysql = require("mysql2");

const config = require("../utils/config");

console.log(config.PASSWORD);

const connection = mysql.createConnection({
  user: "root",
  host: config.HOST,
  password: config.PASSWORD,
  database: config.DATABASE,

  // user: config.USER,
  // host: config.HOST,
  // password: config.PASSWORD,
  // database: config.DATABASE,
});

connection.connect((error) => {
  console.log(config.PASSWORD);
  if (error) {
    console.log(error);
  } else {
    console.log("Connected to database");
  }
});

module.exports = connection;
