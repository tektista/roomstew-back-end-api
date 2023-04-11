const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const listingsRouter = require("./routes/listing.routes");
const roomsRouter = require("./routes/room.routes");
const saveRouter = require("./routes/save.routes");

const errorHandler = require("./utils/errorHandler");
const app = express();

// use body-parser middleware to parse incoming request bodies
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

// use express routers
app.use("/api/listings", listingsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/save", saveRouter);

app.use(errorHandler);

module.exports = app;
