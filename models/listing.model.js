//Description: The model for a listing and functions that interact with listings in the database

const db = require("./db.js");

//constructor for listing object
const Listing = function (listing) {
  this.title = listing.title;
  this.description = listing.description;
  this.thumbnail = listing.thumbnail;
  this.email = listing.email;
  this.phoneNum = listing.phoneNum;

  //details
  this.roomsAvailable = listing.roomsAvailable;
  this.isFurnished = listing.isFurnished;
  this.bathroomCount = listing.bathroomCount;
  this.areBillsIncluded = listing.areBillsIncluded;

  //address
  this.streetAddress = listing.streetAddress;
  this.city;
  this.postcode;

  //times
  this.isExpired = listing.isExpired;
  this.expiryDate = listing.expiryDate;
  this.createDate = listing.createDate;
  this.updateDate = listing.updateDate;

  //preferences
  this.minAge = listing.minAge;
  this.maxAge = listing.maxAge;
  this.genderPreference = listing.genderPreference;
  this.areCouplesAllowed = listing.areCouplesAllowed;
  this.areSmokersAllowed = listing.isSmokingAllowed;
  this.arePetsAllowed = listing.arePetsAllowed;
};

//get all listings from db
Listing.getAll = (title, result) => {
  let query = "SELECT * FROM listing";

  if (title) {
    query = query + ` WHERE title LIKE '%${title}%'`;
  }

  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);

      //wtf is this line
      result(null, err);
      return;
    }

    console.log("listings: ", res);
    result(null, res);
  });
};

//find a specific listing by id
Listing.findById = (id, result) => {
  db.query(`SELECT * FROM listing WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
  });
};

Listing.create = (newListing, result) => {
  db.query("INSERT INTO listing SET ?", newListing, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found tutorial: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Listing.updateById = (id, listing, result) => {
  db.query(
    "UPDATE listing SET title = ?, description = ?, thumbnail = ?, email = ?, phoneNum = ?, roomsAvailable = ?, isFurnished = ?, bathroomCount = ?, areBillsIncluded = ?, streetAddress = ?, city = ?, postcode = ?, isExpired = ?, expiryDate = ?, createDate = ?, updateDate = ?, minAge = ?, maxAge = ?, genderPreference = ?, areCouplesAllowed = ?, areSmokersAllowed = ?, arePetsAllowed = ? WHERE id = ?",
    [
      listing.title,
      listing.description,
      listing.thumbnail,
      listing.email,
      listing.phoneNum,
      listing.roomsAvailable,
      listing.isFurnished,
      listing.bathroomCount,
      listing.areBillsIncluded,
      listing.streetAddress,
      listing.city,
      listing.postcode,
      listing.isExpired,
      listing.expiryDate,
      listing.createDate,
      listing.updateDate,
      listing.minAge,
      listing.maxAge,
      listing.genderPreference,
      listing.areCouplesAllowed,
      listing.areSmokersAllowed,
      listing.arePetsAllowed,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Tutorial with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated tutorial: ", { id: id, ...listing });
      result(null, { id: id, ...listing });
    }
  );
};

Listing.remove = (id, result) => {
  db.query("DELETE FROM listing WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted listing with id: ", id);
    result(null, res);
  });
};

module.exports = Listing;
