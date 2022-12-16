//Description: imports application from app.js and starts the app

//import express from app.js
const app = require("./app");

//import PORT from config.js
const config = require("./utils/config");

//
const port = config.PORT;

//start the app
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
