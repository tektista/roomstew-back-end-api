const mysql = require("mysql2");
const config = require("../utils/config");

const db = mysql.createConnection({
  //NOTE: for some reason "config.USER" doesn't work, but "root" does
  user: "root",
  host: config.HOST,
  password: config.PASSWORD,
  database: config.DATABASE,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Connected to the database");
  }
});

module.exports = db;
