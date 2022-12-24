//Description: The model for a listing and functions that interact with listings in the database

const pool = require("./db.js");

//constructor for listing object
const Listing = function (listing) {
  this.title = listing.title;
  this.description = listing.description;
  this.thumbnail = listing.thumbnail;
  this.email = listing.email;
  this.phone_num = listing.phone_num;

  //details
  this.rooms_available = listing.rooms_available;
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

Listing.findAll = async (title) => {
  let query = "SELECT * FROM listing";

  if (title) {
    query = query + ` WHERE title LIKE '%${title}%'`;
  }

  try {
    const result = await pool.query(query);
    const rows = result[0];
    console.log("listings: ", rows);
    return rows;
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

// Listing.getAll = (title, result) => {
//   let query = "SELECT * FROM listing";

//   if (title) {
//     query = query + ` WHERE title LIKE '%${title}%'`;
//   }

//   db.query(query, (err, res) => {
//     //if error, log error and return
//     if (err) {
//       console.log("error: ", err);

//       // err passed on to controller callback function as first param
//       // second param is null because there is no data due to error
//       result(err, null);
//       return;
//     }
//     //no error, set second param to res which is data param in controller
//     //callback function
//     console.log("listings: ", res);
//     result(null, res);
//   });
// };

//find a specific listing by id

// Listing.findById = (id, result) => {
//   db.query(`SELECT * FROM listing WHERE listing_id = ${id}`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }
//     if (res.length) {
//       console.log("found tutorial: ", res[0]);
//       result(null, res[0]);
//       return;
//     }

//     // not found Tutorial with the id
//     result({ kind: "not_found" }, null);
//   });
// };

// Listing.create = (newListing, result) => {
//   db.query("INSERT INTO listing SET ?", newListing, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     console.log("created listing: ", { id: res.insertId, ...newListing });
//     result(null, { id: res.insertId, ...newListing });
//   });
// };

// Listing.updateById = (id, listing, result) => {
//   db.query(
//     `UPDATE listing SET title = ?, description = ?, thumbnail = ?, email = ?, phone_num = ?, rooms_available = ?, is_furnished = ?, bathroom_count = ?, bills_included = ?, street_address = ?, city = ?, postcode = ?, is_expired = ?, expiry_date = ?, listing_create_date = ?, listing_update_date = ?, min_age = ?, max_age = ?, gender_preference = ?, couples_allowed = ?, smokers_allowed = ?, pets_allowed = ? WHERE listing_id = ${id}`,
//     [
//       listing.title,
//       listing.description,
//       listing.thumbnail,
//       listing.email,
//       listing.phone_num,
//       listing.rooms_available,
//       listing.is_furnished,
//       listing.bathroom_count,
//       listing.bills_included,
//       listing.street_address,
//       listing.city,
//       listing.postcode,
//       listing.is_expired,
//       listing.expiry_date,
//       listing.listing_create_date,
//       listing.listing_update_date,
//       listing.min_age,
//       listing.max_age,
//       listing.gender_preference,
//       listing.couples_allowed,
//       listing.smokers_allowed,
//       listing.pets_allowed,
//     ],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//       }

//       if (res.affectedRows == 0) {
//         // not found Tutorial with the id
//         result({ kind: "not_found" }, null);
//         return;
//       }

//       console.log("updated tutorial: ", { id: id, ...listing });
//       result(null, { id: id, ...listing });
//     }
//   );
// };

// Listing.remove = (id, result) => {
//   db.query("DELETE FROM listing WHERE listing_id = ?", id, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found Tutorial with the id
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     console.log("deleted listing with id: ", id);
//     result(null, res);
//   });
// };

module.exports = Listing;
