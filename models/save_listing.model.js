const { x } = require("joi");
const pool = require("./db.js");

const SaveListing = function (saved) {
  this.user_user_id = saved.user_user_id;
  this.listing_listing_id = saved.listing_listing_id;
};

SaveListing.getSavedListingIdsByUserId = async () => {
  //Hardcode a user
  const USER_ID = 1;
  try {
    const savedQueryResult = await pool.query(
      `SELECT listing_listing_id FROM saved WHERE user_user_id = ${USER_ID}`
    );

    const savedQueryRows = savedQueryResult[0];
    return savedQueryRows;
  } catch (err) {
    throw err;
  }
};

SaveListing.saveAListingByListingAndUserId = async (req) => {
  // Hardcode a user
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
