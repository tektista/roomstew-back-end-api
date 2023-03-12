const pool = require("./db.js");

const ListingPhoto = function (listingPhoto) {
  this.listing_photo = listingPhoto.listing_photo;
  this.listing_photo_order = listingPhoto.listing_photo_order;
  this.listing_photo_create_date = listingPhoto.listing_photo_create_date;
  this.listing_listing_id = listingPhoto.listing_listing_id;
};

/* all functions in this require a listing_id which is provided by 
the listing model
*/

//get all photos for a listing
ListingPhoto.getPhotosForListing = async (id) => {
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

//create one listing photo
ListingPhoto.createAListingPhoto = async (newListingPhoto) => {
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
    For each listing image, create a new listing photo obj
     with a listing_listing id pointing to the current listing
     Then add this to the database
     */

//Insert all photos for a given listing ID and image list
ListingPhoto.createListingPhotos = async (
  listingInsertId,
  listingImageList
) => {
  try {
    for (let i = 0; i < listingImageList.length; i++) {
      //TO DO: validate the listing photos
      const newListingPhoto = new ListingPhoto({
        listing_photo: listingImageList[i].listing_photo,
        listing_photo_order: listingImageList[i].listing_photo_order,
        listing_photo_create_date: new Date(),
        listing_listing_id: listingInsertId,
      });

      const listingPhotoRows = await ListingPhoto.createAListingPhoto(
        newListingPhoto
      );
      return listingPhotoRows;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = ListingPhoto;
