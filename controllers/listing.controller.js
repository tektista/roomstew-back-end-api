const Listing = require("../models/listing.model.js");

//req is from the request when the route is called, res is the response
//we send back to the client calling the route
findAll = (req, res) => {
  const title = req.query.title;

  //the second parameter is a functio0n
  Listing.getAll(title, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving listings.",
      });
    } else res.send(data);
  });
};

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
    email: req.body.email,
    phoneNum: req.body.phoneNum,
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
    minAge: req.body.minAge,
    maxAge: req.body.maxAge,
    genderPreference: req.body.genderPreference,
    areCouplesAllowed: req.body.areCouplesAllowed,
    areSmokersAllowed: req.body.areSmokersAllowed,
    arePetsAllowed: req.body.arePetsAllowed,
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
