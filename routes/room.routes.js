/* Description: Instead of defining functionalities inside routes, we define them in a separate controller file, so routes are easily readable */

const listing = require("../controllers/listing.controller.js");

//create an express router
const roomsRouter = require("express").Router();

//route to get a room by a room's id
roomsRouter.get("/:id", listing.getARoomsDetailsById);

//route to delete a room by a room's id
roomsRouter.delete("/:id", listing.deleteARoomById);

//route to update a room by a room's id
roomsRouter.put("/:id", listing.updateARoomById);

//route to create a room by a listing's id
roomsRouter.post("/:id", listing.createARoomByListingId);

module.exports = roomsRouter;
