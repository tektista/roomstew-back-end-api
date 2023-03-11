//Description: The model for a listing and functions that only interacs with listings in the database
const pool = require("./db.js");

//constructor for listing object
const Listing = function (listing) {
  //address
  this.postcode = listing.postcode;
  this.street_address = listing.street_address;
  this.city = listing.city;
  this.country = listing.country;
  //ADD country

  //BUILDING DETAILS
  this.building_type = listing.building_type;
  this.bills_included = listing.bills_included;
  this.internet_included = listing.internet_included;
  this.is_furnished = listing.is_furnished;
  this.has_living_room = listing.has_living_room;
  this.bathroom_count = listing.bathroom_count;
  this.has_hmo = listing.has_hmo;
  this.has_garden = listing.has_garden;
  this.has_parking = listing.has_parking;

  //PREFERENCES
  this.min_age = listing.min_age;
  this.max_age = listing.max_age;
  this.gender_preference = listing.gender_preference;
  this.couples_allowed = listing.couples_allowed;
  this.smokers_allowed = listing.smokers_allowed;
  this.pets_allowed = listing.pets_allowed;

  //PROPERTY DESCRIPTION
  this.title = listing.title;
  this.description = listing.description;

  //TIMES
  this.is_expired = listing.is_expired;
  this.expiry_date = listing.expiry_date;
  this.listing_create_date = listing.listing_create_date;
  this.listing_update_date = listing.listing_update_date;

  //remove
};

Listing.findAllListings = async (req) => {
  const limit = 1;
  const offset = req.query.offset;
  let listingQuery = `SELECT * FROM listing LIMIT ${limit} OFFSET ${offset}`;

  try {
    //Query to return all listings
    const listingQueryResult = await pool.query(listingQuery);

    //list of listingObjects
    const listingRows = listingQueryResult[0];

    const cardList = [];

    //for each listing
    for (const listing of listingRows) {
      //retrieve a list of rooms for this listing
      let roomQuery = `SELECT * FROM room WHERE listing_listing_id = ${listing.listing_id}`;
      const roomQueryResult = await pool.query(roomQuery);

      //list of room objects
      const roomRows = roomQueryResult[0];

      console.log(roomRows);

      //return number of rooms for this listng
      const numOfRooms = roomRows.length;

      //return the rent of the room with the lowest rent
      const minRoomRent = roomRows.reduce(
        (min, room) => (room.rent < min ? room.rent : min),
        Infinity
      );

      //return the date of the room with the earliest available date
      const earliestRoomDate = roomRows.reduce((minDate, room) => {
        const roomDate = new Date(room.start_date);
        return roomDate < minDate ? roomDate : minDate;
      }, new Date("9999-12-31"));

      console.log(minRoomRent);

      /*
      
      1. query to find photo objects associated with this listing_id, find the one with the lowest photo order,
      and return the base 64 data for this photo object

      2. This will be used as the thumbnail of the card 3. Convert this base 64 data to image

      */

      //Create a card for this listing with the following details
      const Card = {
        id: listing.listing_id,
        title: listing.title,
        thumbnail: listing.title,
        streetAddress: listing.street_address,
        city: listing.city,
        postcode: listing.postcode,
        dateAdded: listing.listing_create_date,
        numRoomsAvailable: numOfRooms,
        minRoomRent: minRoomRent,
        earliestRoomDateAvailable: earliestRoomDate,
      };

      cardList.push(Card);
    }

    /* 
    1. database response will be a list of json listings
    2. We need to send the client a list of objects in the form 

    [{
      //from list of listings json
      title: "title",
      image: "image",
      dateAdded: "dateAdded",

      //from room table
      numRoomsAvailable: 3,
      lowestRoomRent: 456,
      lowestRoomDateAvailable: 21/12/2020,
    }]

    3. for each listing we need to: 
    - create a card object
    - copy title, image and date added to the card object
    - for the current listing, query the database for rooms associated
     with the current listing
    - store the found rooms in a temproom list
    -find the num of rooms, lowest room rent, lowest room date available
    - copy these values over to the card object
    - return this to the controller
    */
    // return cardList;

    return cardList;
  } catch (err) {
    throw err;
  }
};

Listing.findAListingById = async (id) => {
  try {
    const listingQueryResult = await pool.query(
      `SELECT * FROM listing WHERE listing_id = ?`,
      [id]
    );
    const listingRows = listingQueryResult[0];

    const photoQueryResult = await pool.query(
      `SELECT * FROM listing_photo WHERE listing_listing_id = ?`,
      [id]
    );
    const photoRows = photoQueryResult[0];

    return [listingRows, photoRows];
  } catch (err) {
    throw err;
  }
};

Listing.createAListing = async (newListing) => {
  try {
    const result = await pool.query("INSERT INTO listing SET ?", [newListing]);
    const rows = result[0];
    return rows;
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
