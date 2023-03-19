//Description: Instead of defining functionalities inside routes, we define them in a separate controller file,
//so routes are easily readable
const listing = require("../controllers/listing.controller.js");

//express router used to shorten route path to base
const saveRouter = require("express").Router();

// //route to get a specific listing
saveRouter.get("/", listing.getSavedListingIdsByUserId);
saveRouter.post("/:id", listing.saveAListingForAUser);
saveRouter.delete("/:id", listing.deleteAListingForAUser);

module.exports = saveRouter;
