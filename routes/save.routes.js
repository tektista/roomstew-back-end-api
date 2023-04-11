/* Description: Instead of defining functionalities inside routes, we define them in a separate controller file, so routes are easily readable */
const listing = require("../controllers/listing.controller.js");

//create an express router
const saveRouter = require("express").Router();

//route to get a user's saved listings, using a hardcoded user id
saveRouter.get("/", listing.getSavedListingIdsByUserId);

//route to save a listing for a user
saveRouter.post("/:id", listing.saveAListingForAUser);

//route to delete a saved listing for a user
saveRouter.delete("/:id", listing.deleteAListingForAUser);

module.exports = saveRouter;
