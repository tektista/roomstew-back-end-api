const Listing = require("../models/listing.model.js");

// Retrieve all Tutorials from the database (with condition).
findAll = (req, res) => {
  const title = req.query.title;

  Listing.getAll(title, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving listings.",
      });
    } else res.send(data);
  });
};

// Find a single Tutorial with a id
findById = (req, res) => {
  Listing.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Listing with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Listing with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Create and Save a new Tutorial
create = (req, res) => {
  //Create a listing
  const listing = new Listing({
    title: req.body.title,
    description: req.body.description,
    thumbnail: req.body.thumbnail,
    phoneNum: req.body.phoneNum,
    email: req.body.email,
    roomsAvailable: req.body.roomsAvailable,
    isFurnished: req.body.isFurnished,
    bathroomCount: req.body.bathroomCount,
    areBillsIncluded: req.body.areBillsIncluded,
    streetAddress: req.body.streetAddress,
    city: req.body.city,
    postcode: req.body.postcode,
    isExpired: req.body.isExpired,
    expiryDate: req.body.expiryDate,
    createDate: req.body.createDate,
    updateDate: req.body.updateDate,
  });

  // Save a listing in the database FROM MODEL
  Listing.create(listing, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the listing.",
      });
    else res.send(data);
  });
};

// Update a Tutorial identified by the id in the request
updateById = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  console.log(req.body);

  Listing.updateById(req.params.id, new Listing(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Listing with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Listing with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Delete a Tutorial with the specified id in the request
removeById = (req, res) => {};

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  removeById,
};
