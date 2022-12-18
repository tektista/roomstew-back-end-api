//Description: imports application from app.js and starts the server

//import express from app.js
const app = require("./app");

//import PORT from config.js
const config = require("./utils/config");

//start the app
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
