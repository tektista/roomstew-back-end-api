const mysql = require("mysql");
const config = require("../utils/config");

const connection = mysql.createConnection({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
});

connection.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Connected to database");
  }
});

module.exports = connection;
