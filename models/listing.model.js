//Description: The model for a listing and functions that only interacs with listings in the database
const pool = require("./db.js");
const Room = require("./room.model.js");
const ListingPhoto = require("./listing_photo.model.js");

//constructor for listing object
const Listing = function (listing) {
  this.postcode = listing.postcode;
  this.street_address = listing.street_address;
  this.city = listing.city;
  this.country = listing.country;

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
Listing.getAllListings = async (req) => {
  const limit = 1;
  const offset = req.query.offset;
  let listingQuery = `SELECT * FROM listing LIMIT ${limit} OFFSET ${offset}`;

  try {
    const listingQueryResult = await pool.query(listingQuery);

    const listingRows = listingQueryResult[0];

    return listingRows;
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

    const listingPhotoRows = await ListingPhoto.getOrderedPhotosForAListing(id);

    const roomRows = await Room.getRoomsForAListing(id);

    // //Photo handling
    // const photoQueryResult = await pool.query(
    //   `SELECT * FROM listing_photo WHERE listing_listing_id = ?`,
    //   [id]
    // );
    // //We return a list of photo objects

    // const photoRows = photoQueryResult[0];

    // const formattedPhotoRows = [];

    // // sort and format photo rows for use in front end//////
    // photoRows.forEach((photoObj) => {
    //   const formattedPhotoObj = {
    //     listingPhoto: photoObj.listing_photo,
    //   };

    //   formattedPhotoRows.push(formattedPhotoObj);
    // });

    // formattedPhotoRows.sort(
    //   (a, b) => a.listingPhotoOrder - b.listingPhotoOrder
    // );
    // /////////

    return {
      listingObj: listingRows,
      listingPhotoObjList: listingPhotoRows,
      listingRoomIdList: roomRows,
    };
  } catch (err) {
    throw err;
  }
};

//

/*
In the getAllListings controller we take in [{newListing}, {listingPhotos}, {listingRoomsWithRoomPhotos]


1. CreateAlisting -
- insert the listing, 
- return the insertID, and the inserted listing

2. CreatePhotosForAListing -
- insert the photos using the insertId from create a listing
- return the ids of the photos inserted

3. CreateRoomsForA Listing
- insert the rooms using the insertId from create a listing
- return the ids of the rooms inserted 

4. CreatePhotosForARoom
Inserted the rooms using the insert id from create a room
- return the ids of the photos inserted

*/

Listing.createAListing = async (
  newListing,
  listingPhotos,
  listingRoomsWithRoomPhotos
) => {
  try {
    //Insert the new listing
    const listingQueryResult = await pool.query("INSERT INTO listing SET ?", [
      newListing,
    ]);
    const listingRows = listingQueryResult[0];
    //Get the Insert ID of the listing insert
    const listingInsertId = listingRows.insertId;

    //Insert the listing photos, using the insert ID of the listing insert
    const IdsOfListingPhotosInserted =
      await ListingPhoto.createPhotosForAListing(
        listingInsertId,
        listingPhotos
      );

    const roomsInsertedAndIdsOfRoomPhotosInserted =
      await Room.createRoomsForAListing(
        listingInsertId,
        listingRoomsWithRoomPhotos
      );

    return {
      listing: listingRows,
      IdsOflistingPhotosInserted: IdsOfListingPhotosInserted,
      roomsInserted: roomsInsertedAndIdsOfRoomPhotosInserted.roomRowList,
      IdsOfRoomPhotosInserted:
        roomsInsertedAndIdsOfRoomPhotosInserted.IdsOfRoomPhotosInserted,
    };
  } catch (err) {
    throw err;
  }
};

Listing.updateAListingById = async (id, listing) => {
  try {
    const result = await pool.query(
      "UPDATE listing SET postcode = ?, street_address = ?, city = ?, country = ?, building_type = ?, bills_included = ?, internet_included = ?, is_furnished = ?, bathroom_count = ?, has_hmo = ?, has_living_room = ?, has_garden = ?, has_parking = ?, min_age = ?, max_age = ?, gender_preference = ?, couples_allowed = ?, smokers_allowed = ?, pets_allowed = ?, title = ?, description = ?, is_expired = ?, expiry_date = ?, listing_create_date = ?, listing_update_date = ? WHERE listing_id = ?",
      [
        listing.postcode,
        listing.street_address,
        listing.city,
        listing.country,

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

Listing.removeAListingById = async (id) => {
  try {
    result = await pool.query("DELETE FROM listing WHERE listing_id = ?", [id]);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = Listing;
