//This file ocntains the model for a listing and functions to interact with the database and its listings

const db = require("./db.js");

const Listing = function (listing) {
  this.title = listing.title;
  this.description = listing.description;
  this.thumbnail = listing.thumbnail;
  this.phoneNum = listing.phoneNum;
  this.email = listing.email;

  //Maybe not needed
  this.roomsAvailable = listing.roomsAvailable;
  this.isFurnished = listing.isFurnished;
  this.bathhroomCount = listing.bathroomCount;
  this.areBillsIncluded = listing.areBillsIncluded;

  //address
  this.streetAddress = listing.streetAddress;
  this.city;
  this.postcode;

  //times
  this.isExpired = listing.isExpired;
  this.expiryDate = listing.expiryDate;
  this.createdDate = listing.createdDate;
  this.createdBy = listing.createdBy;
};

//
Listing.getAll = (result) => {
  db.query("SELECT * FROM listing", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
  });
};

Listing.findById = (listingId, result) => {
  db.query(`SELECT * FROM listing WHERE id = ${listingId}`, (err, res) => {
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
  });
};

Listing.updateById = (id, listing, result) => {
  db.query(
    "UPDATE listing SET title = ?, description = ?, thumbnail = ?, phoneNum = ?, email = ?, roomsAvailable = ?, isFurnished = ?, bathroomCount = ?, areBillsIncluded = ?, streetAddress = ?, city = ?, postcode = ?, isExpired = ?, expiryDate = ?, createdDate = ?, createdBy = ? WHERE id = ?",
    [
      listing.title,
      listing.description,
      listing.thumbnail,
      listing.phoneNum,
      listing.email,
      listing.roomsAvailable,
      listing.isFurnished,
      listing.bathroomCount,
      listing.areBillsIncluded,
      listing.streetAddress,
      listing.city,
      listing.postcode,
      listing.isExpired,
      listing.expiryDate,
      listing.createdDate,
      listing.createdBy,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
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
  });
};

module.exports = Listing;
