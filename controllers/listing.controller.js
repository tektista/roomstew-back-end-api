const Listing = require("../models/listing.model.js");

//req is from the request when the route is called, res is the response
//we send back to the client calling the route

const getAllListings = async (req, res) => {
  const title = req.query.title;

  try {
    const listings = await Listing.findAll();
    res.send(listings);
  } catch (err) {
    res.status(500).send({ err });
  }
};

// findAll = (req, res) => {
//   const title = req.query.title;

//   Listing.getAll(title, (err, data) => {
//     if (err) {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving listings.",
//       });
//     } else res.send(data);
//   });
// };

// findById = (req, res) => {
//   Listing.findById(req.params.id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found Listing with id ${req.params.id}.`,
//         });
//       } else {
//         res.status(500).send({
//           message: "Error retrieving Listing with id " + req.params.id,
//         });
//       }
//     } else res.send(data);
//   });
// };

// // Create and Save a new Tutorial
// create = (req, res) => {
//   //Create a listing
//   const listing = new Listing({
//     title: req.body.title,
//     description: req.body.description,
//     thumbnail: req.body.thumbnail,
//     email: req.body.email,
//     phone_num: req.body.phone_num,
//     rooms_available: req.body.rooms_available,
//     is_furnished: req.body.is_furnished,
//     bathroom_count: req.body.bathroom_count,
//     bills_included: req.body.bills_included,
//     street_address: req.body.street_address,
//     city: req.body.city,
//     postcode: req.body.postcode,
//     is_expired: req.body.is_expired,
//     expiry_date: req.body.expiry_date,
//     listing_create_date: req.body.listing_create_date,
//     listing_update_date: req.body.listing_update_date,
//     min_age: req.body.min_age,
//     max_age: req.body.max_age,
//     gender_preference: req.body.gender_preference,
//     couples_allowed: req.body.couples_allowed,
//     smokers_allowed: req.body.smokers_allowed,
//     pets_allowed: req.body.pets_allowed,
//   });

//   // Save a listing in the database FROM MODEL
//   Listing.create(listing, (err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the listing.",
//       });
//     else res.send(data);
//   });
// };

// // Update a Tutorial identified by the id in the request
// updateById = (req, res) => {
//   if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty!",
//     });
//   }

//   console.log(req.body);

//   Listing.updateById(req.params.id, new Listing(req.body), (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found Listing with id ${req.params.id}.`,
//         });
//       } else {
//         res.status(500).send({
//           message: "Error updating Listing with id " + req.params.id,
//         });
//       }
//     } else res.send(data);
//   });
// };

// // Delete a Tutorial with the specified id in the request
// removeById = (req, res) => {
//   Listing.remove(req.params.id, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found Listing with id ${req.params.id}.`,
//         });
//       } else {
//         res.status(500).send({
//           message: "Could not delete listing with id " + req.params.id,
//         });
//       }
//     } else res.send({ message: `Listing was deleted successfully!` });
//   });
// };

module.exports = {
  getAllListings,
  // findById,
  // create,
  // updateById,
  // removeById,
};
