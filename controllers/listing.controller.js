const pool = require("../models/db");
const Listing = require("../models/listing.model");
const ListingPhoto = require("../models/listing_photo.model");
const Room = require("../models/room.model");
const { listingSchema } = require("../schemas/listing.schema");

//req is from the request when the route is called, res is the response
//we send back to the client calling the route

const getAllListings = async (req, res, next) => {
  try {
    const result = await Listing.getAllListings(req);
    res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

const getAListingById = async (req, res, next) => {
  try {
    const listingAndPhotos = await Listing.getAListingById(req.params.id);

    if (listingAndPhotos[0].length) {
      res.status(200).json(listingAndPhotos);
    } else {
      res.status(404).json(`Listing with id ${req.params.id} does not exist`);
    }
  } catch (err) {
    return next(err);
  }
};

/*

1. Post the listing
2. Post the listings images
3. For each room, post the room, then post the images for that associated room

*/
const createAListing = async (req, res, next) => {
  try {
    const listing = req.body[0];
    const listingImageList = req.body[1];
    const listingRoomListWithPhotoList = req.body[2];

    const { error, value } = listingSchema.validate(listing);

    const newListing = new Listing({
      postcode: listing.postcode,
      street_address: listing.street_address,
      city: listing.city,
      country: listing.country,

      building_type: listing.building_type,
      bills_included: listing.bills_included,
      internet_included: listing.internet_included,
      is_furnished: listing.is_furnished,
      bathroom_count: listing.bathroom_count,
      has_hmo: listing.has_hmo,
      has_living_room: listing.has_living_room,
      has_garden: listing.has_garden,
      has_parking: listing.has_parking,

      min_age: listing.min_age,
      max_age: listing.max_age,
      gender_preference: listing.gender_preference,
      couples_allowed: listing.couples_allowed,
      smokers_allowed: listing.smokers_allowed,
      pets_allowed: listing.pets_allowed,

      title: listing.title,
      description: listing.description,

      is_expired: listing.is_expired,
      expiry_date: listing.expiry_date,
      listing_create_date: new Date(),
      listing_update_date: new Date(),
    });

    const listingRows = await Listing.createAListing(newListing);
    const listingInsertId = listingRows.insertId;

    //Insert the listing images
    const listingPhotoRows = await ListingPhoto.createPhotosForAListing(
      listingInsertId,
      listingImageList
    );

    // retrieve each insert id
    const roomListWithPhotoList = await Room.createRoomsForAListing(
      listingInsertId,
      listingRoomListWithPhotoList
    );

    /*

    for each room, post the room using the listing insert id.
    then for each image, post the image using the room insert id
    
    */

    // for each room list

    res.status(200).json(listingRows);
  } catch (err) {
    return next(err);
  }
};

const putAListingById = (req, res, next) => {
  try {
    //Joi validation on req body
    const { error, value } = listingSchema.validate(req.body);

    if (error) {
      throw error;
    }

    const result = Listing.updateAListingById(req.params.id, req.body);

    //if no rows were affected, the listing does not exist
    if (result.affectedRows === 0) {
      res.status(400).json(`Listing with id ${req.params.id} does not exist`);
      return;
    }

    //return the updated listing
    res.status(200).json(req.body);
  } catch (err) {
    next(err);
  }
};

const deleteAListingById = async (req, res, next) => {
  try {
    result = await Listing.removeAListingById(req.params.id);

    if (result.affectedRows === 0) {
      res.status(400).json(`Listing with id ${req.params.id} does not exist`);
      return;
    }

    res.status(200).json(`Listing with id ${req.params.id} deleted`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllListings,
  getAListingById,
  createAListing,
  putAListingById,
  deleteAListingById,
};
