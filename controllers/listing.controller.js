const pool = require("../models/db");
const Listing = require("../models/listing.model");
const { listingSchema } = require("../schemas/listing.schema");
const convertListingForFrontEnd = require("../utils/helpers/convertListingForFrontEnd");
const convertRoomForFrontEnd = require("../utils/helpers/convertRoomForFrontEnd");

//req is from the request when the route is called, res is the response
//we send back to the client calling the route

const getAllListings = async (req, res, next) => {
  try {
    const result = await Listing.getAllListings(req);
    const convertedResult = result.map(convertListingForFrontEnd);
    console.log(convertedResult); // apply the conversion function to each object in the list
    res.status(200).json(convertedResult); // return the converted list
  } catch (err) {
    return next(err);
  }
};

const getAListingById = async (req, res, next) => {
  try {
    // [ [{listingObj}], listingPhotoRows, roomRows]
    const listingsRoomsAndPhotos = await Listing.getAListingById(req.params.id);

    const convertedListingObj = convertListingForFrontEnd(
      listingsRoomsAndPhotos[0][0]
    );

    listingsRoomsAndPhotos[0][0] = convertedListingObj;

    console.log(listingsRoomsAndPhotos[0][0]);

    // // // assume `list` is the const variable containing the list
    // const list = [[listingObj], listingPhotoRows, roomRows];

    // // create a new object to replace `listingObj`
    // const newListingObj = { id: 2, name: "New Listing" };

    // // modify the list to replace `listingObj` with the new object
    // list[0] = [newListingObj];

    if (listingsRoomsAndPhotos[0].length) {
      res.status(200).json(listingsRoomsAndPhotos);
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
    //[ {listiingObj}, [{listingPhotoObj}...], [ [{roomObj}, [{photoObj}...]... ]  ]

    //
    const listing = req.body[0];
    const listingPhotos = req.body[1];
    const listingRoomsWithRoomPhotos = req.body[2];

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

    const dataInserted = await Listing.createAListing(
      newListing,
      listingPhotos,
      listingRoomsWithRoomPhotos
    );

    res.status(200).json({ dataInserted });
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
