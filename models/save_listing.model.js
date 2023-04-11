/*
Description: the model for the saved table in the db, containing functions that query the saved table
*/
const pool = require("./db.js");

const SaveListing = function (saved) {
  this.user_user_id = saved.user_user_id;
  this.listing_listing_id = saved.listing_listing_id;
};

/*
return the saved listing ids for a user by user id from the db
*/
SaveListing.getSavedListingIdsByUserId = async () => {
  //hardcoded user id
  const USER_ID = 1;
  try {
    const savedQueryResult = await pool.query(
      `SELECT listing_listing_id FROM saved WHERE user_user_id = ${USER_ID}`
    );

    const savedQueryRows = savedQueryResult[0];
    console.log("saved model", savedQueryRows);
    return savedQueryRows;
  } catch (err) {
    throw err;
  }
};

/*
save a listing for a user by listing id and user id to the db
*/
SaveListing.saveAListingByListingAndUserId = async (req) => {
  //hardcoded user id
  const USER_ID = 1;
  const listingId = req.params.id;

  const newSavedListing = {
    user_user_id: USER_ID,
    listing_listing_id: listingId,
  };

  try {
    const savedQueryResult = await pool.query(
      "INSERT INTO saved SET ?",
      newSavedListing
    );

    return { userId: USER_ID, listingId: listingId };
  } catch (err) {
    throw err;
  }
};

/*
delete a saved listing for a user by listing id and user id from the db
*/
SaveListing.deleteASavedListingByListingAndUserId = async (req) => {
  const USER_ID = 1;
  const listingId = req.params.id;

  try {
    const savedQueryResult = await pool.query(
      `DELETE FROM saved WHERE user_user_id = ${USER_ID} AND listing_listing_id = ${listingId}`
    );

    return { userId: USER_ID, listingId: listingId };
  } catch (err) {
    throw err;
  }
};

module.exports = SaveListing;
