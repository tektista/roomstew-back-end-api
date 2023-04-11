/*
Description: the model for the listing table in the db containing functions that query the listing table
*/
const pool = require("./db.js");
const Room = require("./room.model.js");
const ListingPhoto = require("./listing_photo.model.js");

const Listing = function (listing) {
  this.postcode = listing.postcode;
  this.street_address = listing.street_address;
  this.city = listing.city;
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

/*
returns a list of listings based on the query parameters from the db
*/
Listing.getAllListings = async function getAllListings(req) {
  const filterObj = req.query;
  const offset = req.query.offset;
  const USER_ID = 1;

  //hardcoded limit of 10
  const limit = 10;

  //concatenated to the query string
  let joinCondition = "";
  let cityCondition = "";
  let postcodeCondition = "";
  let dateAvailableCondition = "";
  let minRentCondition = "";
  let maxRentCondition = "";
  let minRoomsCondition = "";
  let maxDepositCondition = "";
  let isRoomFurnishedCondition = "";
  let isRoomEnsuiteCondition = "";
  let isFurnishedCondition = "";
  let hasLivingRoomCondition = "";
  let bathroomCountCondition = "";
  let hasHmoCondition = "";
  let billsIncludedCondition = "";
  let internetIncludedCondition = "";
  let buildingTypeCondition = "";
  let hasGardenCondition = "";
  let hasParkingCondition = "";

  //only set the join condition to room if any of the room filters are set
  if (
    filterObj.dateAvailable ||
    filterObj.minRent ||
    filterObj.maxRent ||
    filterObj.minRooms ||
    filterObj.maxDeposit ||
    filterObj.isRoomFurnished ||
    filterObj.isRoomFurnished === undefined ||
    filterObj.roomIsEnsuite ||
    filterObj.roomIsEnsuite === undefined
  ) {
    joinCondition = "JOIN room ON room.listing_listing_id = listing.listing_id";
  }

  //filters for the listing table
  if (filterObj.city) {
    cityCondition = `AND city LIKE '%${filterObj.city}%'`;
  }

  if (filterObj.postcode) {
    postcodeCondition = `AND postcode LIKE '%${filterObj.postcode}%'`;
  }

  if (filterObj.minRent) {
    minRentCondition = `AND room.rent >= ${filterObj.minRent}`;
  }

  if (filterObj.maxRent) {
    maxRentCondition = `AND room.rent <= ${filterObj.maxRent}`;
  }

  if (filterObj.maxDeposit) {
    maxDepositCondition = `AND room.deposit <= ${filterObj.maxDeposit}`;
  }

  if (filterObj.dateAvailable) {
    dateAvailableCondition = `AND room.start_date <='${filterObj.dateAvailable}'`;
  }

  if (filterObj.minRooms) {
    minRoomsCondition = `
      HAVING COUNT(room.listing_listing_id) >= ${filterObj.minRooms}
    `;
  }

  if (filterObj.isRoomFurnished !== undefined) {
    isRoomFurnishedCondition = `AND room.room_is_furnished = ${filterObj.isRoomFurnished}`;
  }

  if (filterObj.isRoomEnsuite !== undefined) {
    isRoomEnsuiteCondition = `AND room.is_en_suite = ${filterObj.isRoomEnsuite}`;
  }

  if (filterObj.isFurnished !== undefined) {
    isFurnishedCondition = `AND listing.is_furnished = ${filterObj.isFurnished}`;
  }

  if (filterObj.hasLivingRoom !== undefined) {
    hasLivingRoomCondition = `AND listing.has_living_room = ${filterObj.hasLivingRoom}`;
  }

  if (filterObj.bathroomCount !== undefined) {
    bathroomCountCondition = `AND listing.bathroom_count = ${filterObj.bathroomCount}`;
  }

  if (filterObj.hasHmo !== undefined) {
    hasHmoCondition = `AND listing.has_hmo = ${filterObj.hasHmo}`;
  }

  if (filterObj.billsIncluded !== undefined) {
    billsIncludedCondition = `AND listing.bills_included = ${filterObj.billsIncluded}`;
  }

  if (filterObj.internetIncluded !== undefined) {
    internetIncludedCondition = `AND listing.internet_included = ${filterObj.internetIncluded}`;
  }

  if (filterObj.buildingType) {
    buildingTypeCondition = `AND listing.building_type = '${filterObj.buildingType}'`;
  }

  if (filterObj.hasGarden !== undefined) {
    hasGardenCondition = `AND listing.has_garden = ${filterObj.hasGarden}`;
  }

  if (filterObj.hasParking !== undefined) {
    hasParkingCondition = `AND listing.has_parking = ${filterObj.hasParking}`;
  }

  const listingQuery = `
  SELECT DISTINCT listing.*
  FROM listing
  ${joinCondition}
  WHERE user_user_id != ${USER_ID}
  ${cityCondition}
  ${postcodeCondition}
  ${minRentCondition}
  ${maxRentCondition}
  ${maxDepositCondition}
  ${dateAvailableCondition}
  ${isRoomFurnishedCondition}
  ${isRoomEnsuiteCondition}
  ${isFurnishedCondition}
  ${hasLivingRoomCondition}
  ${bathroomCountCondition}
  ${hasHmoCondition}
  ${billsIncludedCondition}
  ${internetIncludedCondition}
  ${buildingTypeCondition}
  ${hasGardenCondition}
  ${hasParkingCondition}
  GROUP BY listing.listing_id
  ${minRoomsCondition}
  ORDER BY listing.listing_create_date DESC
  LIMIT ${limit} OFFSET ${offset}
`;

  try {
    const listingQueryResult = await pool.query(listingQuery);
    return listingQueryResult[0];
  } catch (err) {
    throw err;
  }
};

/*
return a list of listings, given a list of listing id's from the db
 */
Listing.getAllListingsByListingIds = async (listingIds, req) => {
  const limit = 100;
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

//return a listing by listing id
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

/*
return listings by user id from the db
*/
Listing.getAllListingsByUserId = async (req) => {
  //user is hardcoded
  const USER_ID = 1;
  //hardcoded limit for 100
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

/*
create a listing
*/
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

/*
update a listing's specified details from the db
*/
Listing.updateListingDetails = async (listingId, listingDetailsObj) => {
  const listing = listingDetailsObj;

  try {
    const listingQueryResult = await pool.query(
      "UPDATE listing SET title = ?, description= ?, min_age = ?, max_age = ?, gender_preference = ?, couples_allowed = ?, smokers_allowed = ?, pets_allowed = ? WHERE listing_id = ?",
      [
        listing.title,
        listing.description,
        listing.min_age,
        listing.max_age,
        listing.gender_preference,
        listing.couples_allowed,
        listing.smokers_allowed,
        listing.pets_allowed,
        listingId,
      ]
    );
    return listingQueryResult[0];
  } catch (err) {
    throw err;
  }
};

/*
remove a listing by id from the db
*/
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
