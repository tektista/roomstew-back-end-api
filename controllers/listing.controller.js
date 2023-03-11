const pool = require("../models/db");
const Listing = require("../models/listing.model");
const { listingSchema } = require("../schemas/listing.schema");

//req is from the request when the route is called, res is the response
//we send back to the client calling the route

const getAllListings = async (req, res, next) => {
  try {
    console.log("Hello");
    const result = await Listing.findAllListings(req);
    console.log("Bye");

    res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

const getAListingById = async (req, res, next) => {
  try {
    const listingAndPhotos = await Listing.findAListingById(req.params.id);

    if (listingAndPhotos[0].length) {
      res.status(200).json(listingAndPhotos);
    } else {
      res.status(404).json(`Listing with id ${req.params.id} does not exist`);
    }
  } catch (err) {
    return next(err);
  }
};

const postAListing = async (req, res, next) => {
  try {
    const { error, value } = listingSchema.validate(req.body);

    if (error) {
      throw error;
    }

    const newListing = new Listing({
      //LOCATION
      postcode: req.body.postcode,
      street_address: req.body.street_address,
      city: req.body.city,
      country: req.body.country,

      //BUILDING DETAILS
      building_type: req.body.building_type,
      bills_included: req.body.bills_included,
      internet_included: req.body.internet_included,
      is_furnished: req.body.is_furnished,
      bathroom_count: req.body.bathroom_count,
      has_hmo: req.body.has_hmo,
      has_living_room: req.body.has_living_room,
      has_garden: req.body.has_garden,
      has_parking: req.body.has_parking,

      //PREFERENCES
      min_age: req.body.min_age,
      max_age: req.body.max_age,
      gender_preference: req.body.gender_preference,
      couples_allowed: req.body.couples_allowed,
      smokers_allowed: req.body.smokers_allowed,
      pets_allowed: req.body.pets_allowed,

      //PROPERTY DESCRIPTION
      title: req.body.title,
      description: req.body.description,

      //TIMES
      is_expired: req.body.is_expired,
      expiry_date: req.body.expiry_date,
      listing_create_date: req.body.listing_create_date,
      listing_update_date: req.body.listing_update_date,
    });

    console.log(newListing);

    const result = await Listing.createAListing(newListing);
    res.status(200).json(newListing);
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
  postAListing,
  putAListingById,
  deleteAListingById,
};
