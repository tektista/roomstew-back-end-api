//Description: The model for a listing and functions that only interacs with listings in the database
const pool = require("./db.js");
const Room = require("./room.model.js");
const ListingPhoto = require("./listing_photo.model.js");

//constructor for listing object
const Listing = function (listing) {
  this.postcode = listing.postcode;
  this.street_address = listing.street_address;
  this.city = listing.city;
  // this.country = listing.country;

  this.building_type = listing.building_type;
  this.bills_included = listing.bills_included;
  this.internet_included = listing.internet_included;
  this.is_furnished = listing.is_furnished;
  this.has_living_room = listing.has_living_room;
  this.bathroom_count = listing.bathroom_count;
  this.has_hmo = listing.has_hmo;
  this.has_garden = listing.has_garden;
  this.has_parking = listing.has_parking;

  this.min_age = listing.min_age;
  this.max_age = listing.max_age;
  this.gender_preference = listing.gender_preference;
  this.couples_allowed = listing.couples_allowed;
  this.smokers_allowed = listing.smokers_allowed;
  this.pets_allowed = listing.pets_allowed;

  this.title = listing.title;
  this.description = listing.description;

  this.is_expired = listing.is_expired;
  this.expiry_date = listing.expiry_date;
  this.listing_create_date = listing.listing_create_date;
  this.listing_update_date = listing.listing_update_date;
};

//Function for retrieving information required for a card listing
Listing.getAllListings = async function getAllListings(req) {
  const USER_ID = 1;
  const limit = 1;
  const offset = req.query.offset;
  console.log(req.query.city);
  const rawCity = req.query.city || "";
  const rawMinRent = req.query.minRent || "";
  const rawMaxRent = req.query.maxRent || "";
  const rawMinRoomsAvailable = req.query.minRooms || "";

  const city = rawCity.trim();
  const minRent = rawMinRent !== "" ? rawMinRent : "";
  const maxRent = rawMaxRent !== "" ? rawMaxRent : "";
  const minRoomsAvailable =
    rawMinRoomsAvailable !== "" ? rawMinRoomsAvailable : "";

  let joinCondition = "";
  let cityCondition = "";
  let minRentCondition = "";
  let maxRentCondition = "";
  let minRoomsAvailableCondition = "";

  if (minRent !== "" || maxRent !== "" || minRoomsAvailable !== "") {
    joinCondition = "JOIN room ON room.listing_listing_id = listing.listing_id";
  }

  if (city) {
    cityCondition = `AND city LIKE '%${city}%'`;
  }

  if (minRent !== "") {
    minRentCondition = `AND room.rent >= ${minRent}`;
  }

  if (maxRent !== "") {
    maxRentCondition = `AND room.rent <= ${maxRent}`;
  }

  if (minRoomsAvailable !== "") {
    minRoomsAvailableCondition = `
      HAVING COUNT(room.listing_listing_id) >= ${minRoomsAvailable}
    `;
  }

  const listingQuery = `
    SELECT DISTINCT listing.*
    FROM listing
    ${joinCondition}
    WHERE user_user_id != ${USER_ID}
    ${cityCondition}
    ${minRentCondition}
    ${maxRentCondition}
    GROUP BY listing.listing_id
    ${minRoomsAvailableCondition}
    ORDER BY listing.listing_create_date DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  console.log("Query start");
  console.log(listingQuery);

  try {
    const listingQueryResult = await pool.query(listingQuery);
    return listingQueryResult[0];
  } catch (err) {
    throw err;
  }
};

Listing.getAllListingsByListingIds = async (listingIds, req) => {
  const limit = 1;
  const offset = req.query.offset;
  try {
    const listingRowList = [];
    for (let i = offset; i < offset + limit; i++) {
      if (i >= listingIds.length) break;
      const listingId = listingIds[i];
      const listingRow = await Listing.getAListingById(listingId);
      listingRowList.push(listingRow[0]);
    }
    return listingRowList;
  } catch (err) {
    throw err;
  }
};

//function for retrieving information needed for a cards details
Listing.getAListingById = async (id) => {
  try {
    const listingQueryResult = await pool.query(
      `SELECT * FROM listing WHERE listing_id = ?`,
      [id]
    );
    const listingRows = listingQueryResult[0];
    return listingRows;
  } catch (err) {
    throw err;
  }
};

Listing.getAllListingsByUserId = async (req) => {
  //HARDCODE A USER for getting their own listings
  const USER_ID = 1;
  const limit = 100;
  const offset = req.query.offset;
  let listingQuery = `SELECT * FROM listing WHERE user_user_id = ${USER_ID} LIMIT ${limit} OFFSET ${offset}`;

  try {
    const listingQueryResult = await pool.query(listingQuery);

    const listingRows = listingQueryResult[0];
    return listingRows;
  } catch (err) {
    throw err;
  }
};

Listing.createAListing = async (newListing) => {
  try {
    const listingQueryResult = await pool.query("INSERT INTO listing SET ?", [
      newListing,
    ]);
    const listingRows = listingQueryResult[0];
    return { listingRows: listingRows, insertedListing: newListing };
  } catch (err) {
    throw err;
  }
};

Listing.updateAListingById = async (id, listing) => {
  try {
    const result = await pool.query(
      "UPDATE listing SET postcode = ?, street_address = ?, city = ?,  building_type = ?, bills_included = ?, internet_included = ?, is_furnished = ?, bathroom_count = ?, has_hmo = ?, has_living_room = ?, has_garden = ?, has_parking = ?, min_age = ?, max_age = ?, gender_preference = ?, couples_allowed = ?, smokers_allowed = ?, pets_allowed = ?, title = ?, description = ?, is_expired = ?, expiry_date = ?, listing_create_date = ?, listing_update_date = ? WHERE listing_id = ?",
      [
        listing.postcode,
        listing.street_address,
        listing.city,
        // listing.country,

        listing.building_type,
        listing.bills_included,
        listing.internet_included,
        listing.is_furnished,
        listing.bathroom_count,
        listing.has_hmo,
        listing.has_living_room,
        listing.has_garden,
        listing.has_parking,

        listing.min_age,
        listing.max_age,
        listing.gender_preference,
        listing.couples_allowed,
        listing.smokers_allowed,
        listing.pets_allowed,

        listing.title,
        listing.description,

        listing.is_expired,
        listing.expiry_date,
        listing_create_date,
        listing_update_date,

        id,
      ]
    );
    rows = result[0];
    return result;
  } catch (err) {
    throw err;
  }
};

Listing.deleteAListingById = async (id) => {
  try {
    const listingQueryResult = await pool.query(
      "DELETE FROM listing WHERE listing_id = ?",
      [id]
    );
    return listingQueryResult[0];
  } catch (err) {
    throw err;
  }
};

module.exports = Listing;
