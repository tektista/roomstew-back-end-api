const express = require("express");
const app = express();

//fix for allowing front-end and back-end to have different sources e.g. localhost3000 and 3001
const cors = require("cors");
app.use(cors());

//middleware built into express to recognize the incoming Request Object as a JSON Object
app.use(express.json());

module.exports = app;
