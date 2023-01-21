//Description: The model for a listing and functions that only interacs with listings in the database
const pool = require("./db.js");

//constructor for listing object
const Listing = function (listing) {
  this.title = listing.title;
  this.description = listing.description;
  this.thumbnail = listing.thumbnail;
  this.email = listing.email;
  this.phone_num = listing.phone_num;

  //details
  this.is_furnished = listing.is_furnished;
  this.bathroom_count = listing.bathroom_count;
  this.bills_included = listing.bills_included;

  //address
  this.street_address = listing.street_address;
  this.city;
  this.postcode;

  //times
  this.is_expired = listing.is_expired;
  this.expiry_date = listing.expiry_date;
  this.listing_create_date = listing.listing_create_date;
  this.listing_update_date = listing.listing_update_date;

  //preferences
  this.min_age = listing.min_age;
  this.max_age = listing.max_age;
  this.gender_preference = listing.gender_preference;
  this.couples_allowed = listing.couples_allowed;
  this.smokers_allowed = listing.smokers_allowed;
  this.pets_allowed = listing.pets_allowed;
};

Listing.findAllListings = async (title) => {
  let listingQuery = "SELECT * FROM listing";

  // if (title) {
  //   query = query + ` WHERE title LIKE '%${title}%'`;
  // }

  try {
    // const date = "2022-06-01 00:00:00";
    // const date2 = "2022-06-11 00:00:00";

    // if (date2 > date) {
    //   console.log(date2);
    // }

    const listingQueryResult = await pool.query(listingQuery);
    const listingRows = listingQueryResult[0];
    const cardList = [];

    for (const listing of listingRows) {
      let roomQuery = `SELECT * FROM room WHERE listing_listing_id = ${listing.listing_id}`;
      const roomQueryResult = await pool.query(roomQuery);
      const roomRows = roomQueryResult[0];

      const numOfRooms = roomRows.length;
      const minRoomRent = roomRows.reduce((prev, current) => {
        if (prev.rent < current.rent) {
          return prev.rent;
        } else {
          return current.rent;
        }
      });
      const earliestRoomDate = roomRows.reduce((prev, current) => {
        let prevDate = new Date(prev.start_date);
        let currentDate = new Date(current.start_date);

        if (prevDate < currentDate) {
          return prevDate;
        } else {
          return currentDate;
        }
      });

      const Card = {
        id: listing.listing_id,
        title: listing.title,
        image: listing.thumbnail,
        dateAdded: listing.listing_create_date,
        numRoomsAvailable: numOfRooms,
        minRoomRent: minRoomRent,
        earliestRoomDateAvailable: earliestRoomDate,
      };

      console.log(cardList);
      cardList.push(Card);
      console.log(cardList);
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
    return cardList;
  } catch (err) {
    throw err;
  }
};

Listing.findAListingById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM listing WHERE listing_id = ?`,
      [id]
    );
    const rows = result[0];
    return rows;
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
      "UPDATE listing SET title = ?, description = ?, thumbnail = ?, email = ?, phone_num = ?, is_furnished = ?, bathroom_count = ?, bills_included = ?, street_address = ?, city = ?, postcode = ?, is_expired = ?, expiry_date = ?, listing_create_date = ?, listing_update_date = ?, min_age = ?, max_age = ?, gender_preference = ?, couples_allowed = ?, smokers_allowed = ?, pets_allowed = ? WHERE listing_id = ?",
      [
        listing.title,
        listing.description,
        listing.thumbnail,
        listing.email,
        listing.phone_num,
        listing.is_furnished,
        listing.bathroom_count,
        listing.bills_included,
        listing.street_address,
        listing.city,
        listing.postcode,
        listing.is_expired,
        listing.expiry_date,
        listing.listing_create_date,
        listing.listing_update_date,
        listing.min_age,
        listing.max_age,
        listing.gender_preference,
        listing.couples_allowed,
        listing.smokers_allowed,
        listing.pets_allowed,
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
