const { x } = require("joi");
const pool = require("./db.js");

const SavedListing = function (saved) {
  this.user_user_id = saved.user_user_id;
  this.listing_listing_id = saved.listing_listing_id;
};

SavedListing.getSavedListingIdsByUserId = async () => {
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
module.exports = SavedListing;
