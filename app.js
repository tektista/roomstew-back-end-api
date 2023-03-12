// const express = require("express");
// const cors = require("cors");
// const listingsRouter = require("./routes/listing.routes");
// const errorHandler = require("./utils/errorHandler");

// const app = express();
// //
// app.use(express.bodyParser({ limit: "50mb" }));

// app.use(cors());

// //middleware built into express to recognize the incoming Request Object as a JSON Object
// app.use(express.json());

// //use listings routes with path /api/listings
// app.use("/api/listings", listingsRouter);

// //error handler middleware
// app.use(errorHandler);

// module.exports = app;

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); // require body-parser middleware
const listingsRouter = require("./routes/listing.routes");
const errorHandler = require("./utils/errorHandler");

const app = express();

// use body-parser middleware to parse incoming request bodies
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());
app.use("/api/listings", listingsRouter);
app.use(errorHandler);

module.exports = app;
