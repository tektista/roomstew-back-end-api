// Description: Instead of defining functionalities inside routes, we define them in a separate controller file,
// so routes are easily readable
const listingController = require("../controllers/listing.controller.js");

// Express router used to shorten route path to base
const listingsRouter = require("express").Router();

// Route to get all listings - call listing.findAll function from controller
listingsRouter.get("/", listingController.getAllListings);

// Route to get all listings for a user
listingsRouter.get("/user", listingController.getAllListingsByUserId);

// Route to get all listings by a user's saved listings
listingsRouter.get("/save", listingController.getAllListingsByListingIds);

// Route to get a specific listing
listingsRouter.get("/:id", listingController.getAListingById);

// Route to create a listing
listingsRouter.post("/", listingController.createAListing);

// Route to update a listing
listingsRouter.put("/:id", listingController.updateAListingById);

// Route to delete a listing
listingsRouter.delete("/:id", listingController.deleteAListingById);

module.exports = listingsRouter;
