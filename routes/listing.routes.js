/* Description: instead of defining functionalities inside routes, we define them in a separate controller file, so routes are easily readable */

const listingController = require("../controllers/listing.controller.js");

// create an express router
const listingsRouter = require("express").Router();

// route to get all listings
listingsRouter.get("/", listingController.getAllListings);

// route to get all listings for hardcoded user
listingsRouter.get("/user", listingController.getAllListingsByUserId);

// route to get a user's saved listings, using the saved table from db
listingsRouter.get("/save", listingController.getAllListingsByListingIds);

// route to get a listing by a listing's id
listingsRouter.get("/:id", listingController.getAListingById);

// route to create a listing
listingsRouter.post("/", listingController.createAListing);

// route ot update a listing
listingsRouter.put("/:id", listingController.updateAListingById);

// Rroute to delete a listing
listingsRouter.delete("/:id", listingController.deleteAListingById);

module.exports = listingsRouter;
