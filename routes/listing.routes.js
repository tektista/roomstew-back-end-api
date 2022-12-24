//Description: Instead of defining functionalities inside routes, we define them in a separate controller file,
//so routes are easily readable
const listing = require("../controllers/listing.controller.js");

//express router used to shorten route path to base
const listingsRouter = require("express").Router();

//route to get all listings - call listing.findAll function from controller
listingsRouter.get("/", listing.findAll);

//route to get a specific listing
listingsRouter.get("/:id", listing.findById);

//route to create a listing
listingsRouter.post("/", listing.create);

//route to update a listing
listingsRouter.put("/:id", listing.updateById);

//route to delete a listing
listingsRouter.delete("/:id", listing.removeById);

module.exports = listingsRouter;
