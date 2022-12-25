const express = require("express");
const cors = require("cors");
const listingsRouter = require("./routes/listing.routes");
const errorHandler = require("./utils/errorHandler");

const app = express();

app.use(cors());

//middleware built into express to recognize the incoming Request Object as a JSON Object
app.use(express.json());

//use listings routes with path /api/listings
app.use("/api/listings", listingsRouter);

//error handler middleware
app.use(errorHandler);

module.exports = app;
