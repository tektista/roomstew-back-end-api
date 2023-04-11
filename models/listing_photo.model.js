/*
Description: the model for the listing_photo table in the db, containing functions that query the listing_photo table
*/

const pool = require("./db.js");

const ListingPhoto = function (listingPhoto) {
  this.listing_photo = listingPhoto.listing_photo;
  this.listing_photo_order = listingPhoto.listing_photo_order;
  this.listing_photo_create_date = listingPhoto.listing_photo_create_date;
  this.listing_listing_id = listingPhoto.listing_listing_id;
};

/*
return the first photo for a listing by id from the db
*/
ListingPhoto.getThumbnailForAListing = async (id) => {
  try {
    const listingPhotoQueryResult = await pool.query(
      "SELECT * FROM listing_photo WHERE listing_listing_id = ? ORDER BY listing_photo_order ASC LIMIT 1",
      [id]
    );
    const listingPhotoRows = listingPhotoQueryResult[0];

    return listingPhotoRows;
  } catch (err) {
    throw err;
  }
};

/*
return all photos for a listing by id from the db
*/
ListingPhoto.getPhotosForAListing = async (id) => {
  try {
    const listingPhotoQueryResult = await pool.query(
      "SELECT * FROM listing_photo WHERE listing_listing_id = ?",
      [id]
    );
    const listingPhotoRows = listingPhotoQueryResult[0];
    return listingPhotoRows;
  } catch (err) {
    throw err;
  }
};

/*
return all photos for a listing by id from the db, ordered by listing_photo_order
*/
ListingPhoto.getOrderedPhotosForAListing = async (id) => {
  try {
    const listingPhotoQueryResult = await pool.query(
      "SELECT * FROM listing_photo WHERE listing_listing_id = ? ORDER BY listing_photo_order ASC",
      [id]
    );
    const listingPhotoRows = listingPhotoQueryResult[0];

    const listingPhotoRowsWithoutId = listingPhotoRows.map(
      (listingPhotoObj) => ({
        listing_photo: listingPhotoObj.listing_photo,
      })
    );

    return listingPhotoRowsWithoutId;
  } catch (err) {
    throw err;
  }
};

/*
insert a photo for a listing into the db
*/
ListingPhoto.createAPhotoForAListing = async (newListingPhoto) => {
  try {
    const listingPhotoQueryResult = await pool.query(
      "INSERT INTO listing_photo SET ?",
      [newListingPhoto]
    );
    const listingPhotoRows = listingPhotoQueryResult[0];
    return listingPhotoRows;
  } catch (err) {
    throw err;
  }
};

/* 
 insert photos for a listing into the db
*/
ListingPhoto.createPhotosForAListing = async (
  listingInsertId,
  listingPhotos
) => {
  try {
    const IdsOfListingPhotosInserted = [];

    for (let i = 0; i < listingPhotos.length; i++) {
      const newListingPhoto = new ListingPhoto({
        listing_photo: listingPhotos[i].listing_photo,
        listing_photo_order: listingPhotos[i].listing_photo_order,
        listing_photo_create_date: new Date(),
        listing_listing_id: listingInsertId,
      });

      const listingPhotoRows = await ListingPhoto.createAPhotoForAListing(
        newListingPhoto
      );

      IdsOfListingPhotosInserted.push(listingPhotoRows.insertId);
    }
    return IdsOfListingPhotosInserted;
  } catch (err) {
    throw err;
  }
};

/*
delete all photos for a listing by listing id from the db
*/
ListingPhoto.deleteListingPhotosByListingId = async (listingId) => {
  try {
    const listingPhotoQueryResult = await pool.query(
      "DELETE FROM listing_photo WHERE listing_listing_id = ?",
      [listingId]
    );
    const listingPhotoRows = listingPhotoQueryResult[0];
    return listingPhotoRows;
  } catch (err) {
    throw err;
  }
};

module.exports = ListingPhoto;
