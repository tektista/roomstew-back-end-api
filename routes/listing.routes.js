//Description: Instead of defining functionalities inside routes, we define them in a separate controller file,
//so routes are easily readable
const listing = require("../controllers/listing.controller.js");

//express router used to shorten route path to base
const listingsRouter = require("express").Router();

//route to get all listings - call listing.findAll function from controller
listingsRouter.get("/", listing.getAllListings);

// //route to get a specific listing
listingsRouter.get("/:id", listing.getAListingById);

//route to create a listing
listingsRouter.post("/", listing.postAListing);

//route to update a listing
listingsRouter.put("/:id", listing.putAListingById);

//route to delete a listing
listingsRouter.delete("/:id", listing.deleteAListingById);

module.exports = listingsRouter;
