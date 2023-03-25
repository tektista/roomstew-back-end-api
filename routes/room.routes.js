//Description: Instead of defining functionalities inside routes, we define them in a separate controller file,
//so routes are easily readable
const listing = require("../controllers/listing.controller.js");

//express router used to shorten route path to base
const roomsRouter = require("express").Router();

// //route to get a specific listing
roomsRouter.get("/:id", listing.getARoomsDetailsById);

roomsRouter.delete("/:id", listing.deleteARoomById);

roomsRouter.put("/:id", listing.updateARoomById);

roomsRouter.post("/:id", listing.createARoomByListingId);

module.exports = roomsRouter;
