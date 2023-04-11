/* Description: 
this is the controller for the api
the functions in this file are called by the routes in the route folder
the functions in the file call model functions from their respective models and then return a response to the database
*/

const pool = require("../models/db");

const Listing = require("../models/listing.model");
const ListingPhoto = require("../models/listing_photo.model");
const Room = require("../models/room.model");
const RoomPhoto = require("../models/room_photo.model");
const SaveListing = require("../models/save_listing.model");

const { listingSchema } = require("../schemas/listing.schema");

/* LISTINGS */

/* 
returns a list of card objects by calling required model functions
*/
const getAllListings = async (req, res, next) => {
  try {
    const cardList = [];
    const listingRows = await Listing.getAllListings(req);

    for (const listing of listingRows) {
      const listingPhotoRows = await ListingPhoto.getThumbnailForAListing(
        listing.listing_id
      );

      const roomCountQueryResult = await Room.getRoomCountForAListing(
        listing.listing_id
      );

      const roomCount = roomCountQueryResult[0][0].count;

      const minRoomRentForAListingQueryResult =
        await Room.getMinRoomRentForAListing(listing.listing_id);
      const minRoomRent = minRoomRentForAListingQueryResult[0][0].min_rent;

      const minRoomStartDateForAListingQueryResult =
        await Room.getMinRoomStartDateForAListing(listing.listing_id);
      const minRoomStartDate =
        minRoomStartDateForAListingQueryResult[0][0].min_start_date;

      const listingCard = {
        listing_id: listing.listing_id,
        title: listing.title,
        listingPhotoRows: listingPhotoRows,
        street_address: listing.street_address,
        city: listing.city,
        postcode: listing.postcode,
        listing_create_date: listing.listing_create_date,
        numRoomsAvailable: roomCount,
        minRoomRent: minRoomRent,
        earliestRoomDateAvailable: minRoomStartDate,
        hasLivingRoom: listing.has_living_room,
        hasHMO: listing.has_hmo,
        bathroomCount: listing.bathroom_count,
      };
      cardList.push(listingCard);
    }

    res.status(200).json(cardList);
  } catch (err) {
    return next(err);
  }
};

/*
returns one card object by id by calling required model functions
*/
const getAListingById = async (req, res, next) => {
  try {
    //{listingObj: [{listingObj}], listingPhotoObjList: [{listingPhoto}...], listingRoomIdList: [1,2,3] }
    const listingId = req.params.id;
    const listingRows = await Listing.getAListingById(listingId);
    const listingPhotoRows = await ListingPhoto.getPhotosForAListing(listingId);

    const listingRoomCardDetailsRows =
      await Room.getRoomsCardDetailsForAListing(listingId);

    const listingDataObj = {
      listingObj: listingRows,
      listingPhotoObjList: listingPhotoRows,
      listingRoomCardDetailsList: listingRoomCardDetailsRows,
    };

    res.status(200).json(listingDataObj);
  } catch (err) {
    return next(err);
  }
};

/*
creates a listing by calling required model functions
*/
const createAListing = async (req, res, next) => {
  try {
    // [{listingObj: {listingObj}, listingPhotoObjList: [{listingPhotoObj}...], listingRoomObjList: [{roomObj}...]
    const listing = req.body.listingObj;
    const listingPhotos = req.body.listingPhotoObjList;
    const listingRoomsAndRoomPhotosObjList =
      req.body.listingRoomsAndRoomPhotosObjList;

    const { error, value } = listingSchema.validate(listing);

    const newListing = new Listing({
      postcode: listing.postcode,
      street_address: listing.street_address,
      city: listing.city,
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

    const listingInsertData = await Listing.createAListing(newListing);
    const insertedListing = listingInsertData.insertedListing;
    const listingInsertId = listingInsertData.listingRows.insertId;

    const IdsOfListingPhotosInserted =
      await ListingPhoto.createPhotosForAListing(
        listingInsertId,
        listingPhotos
      );

    //[ {roomObj: {roomObj}, IdsOfRoomsInserted: [1,2,3..]}... ]
    const roomDataObjInsertedList = [];
    //dor each  obj in the list:  [ {roomObj: {roomObj}, roomObjPhotoList: [{roomPhotoObj}...] }...]
    for (const roomDataObj of listingRoomsAndRoomPhotosObjList) {
      //set the listing id of the room to the insert id of the listing
      roomDataObj.roomObj.listing_listing_id = listingInsertId;

      const roomInsertData = await Room.createARoom(roomDataObj.roomObj);
      const roomInsertId = roomInsertData.roomRows.insertId;
      const roomPhotoObjList = roomDataObj.roomPhotoObjList;

      //insert the photos for the room, using the insert Id of the room
      const IdsOfRoomPhotosInserted = await RoomPhoto.createPhotosForARoom(
        roomInsertId,
        roomPhotoObjList
      );

      const insertedRoomDataObj = {
        roomObj: roomInsertData.insertedRoom,
        IdsOfRoomPhotosInserted: IdsOfRoomPhotosInserted,
      };

      roomDataObjInsertedList.push(insertedRoomDataObj);
    }

    const dataInserted = {
      listingDataInserted: {
        insertedlistingObj: insertedListing,
        IdsOfListingPhotosInserted: IdsOfListingPhotosInserted,
      },
      roomDataObjInsertedList: roomDataObjInsertedList,
    };
    res.status(200).json(dataInserted);
  } catch (err) {
    return next(err);
  }
};

/*
update a listing by id by calling required model functions
*/
const updateAListingById = async (req, res, next) => {
  const listingId = req.params.id;
  const updateObj = req.body;
  const listingDetailsObj = updateObj.listingDetails;
  const listingPhotoObjList = updateObj.listingPhotoObjList;
  try {
    const listingRows = await Listing.updateListingDetails(
      listingId,
      listingDetailsObj
    );

    const listingPhotoRows = await ListingPhoto.deleteListingPhotosByListingId(
      listingId
    );

    const listingPhotoInsertIdList = await ListingPhoto.createPhotosForAListing(
      listingId,
      listingPhotoObjList
    );

    res
      .status(200)
      .json(
        `Listing with id ${listingId} updated, ${listingPhotoRows.affectedRows} photos deleted, ${listingPhotoInsertIdList.length} photos inserted`
      );
  } catch (err) {
    throw err;
  }
};

/*
delete a listing by id by calling required model functions
*/
const deleteAListingById = async (req, res, next) => {
  try {
    const listingId = req.params.id;

    const roomRowsIds = await Room.getRoomIdsForAListing(req.params.id);

    let roomPhotosAffected = 0;

    for (const roomRowObj of roomRowsIds) {
      //delete all the room photos for a room
      const roomPhotoRows = await RoomPhoto.deleteRoomPhotosByRoomId(
        roomRowObj.room_id
      );

      roomPhotosAffected += roomPhotoRows.affectedRows;
    }
    //delete all the rooms for a listing
    const roomRows = await Room.deleteRoomsByListingId(listingId);

    //delete all the listing photos for a listing
    const listingPhotoRows = await ListingPhoto.deleteListingPhotosByListingId(
      listingId
    );
    //delete the listing
    const listingQueryRows = await Listing.deleteAListingById(req.params.id);
    res
      .status(200)
      .json(
        `Listing with id ${listingId} deleted, ${listingPhotoRows.affectedRows} listing photos deleted, ${roomRows.affectedRows} rooms deleted, ${roomPhotosAffected} room photos deleted `
      );
  } catch (err) {
    next(err);
  }
};

/*  ROOMS */

/* returns a room object  by calling required model functions */
const getARoomsDetailsById = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const roomRows = await Room.getARoomById(roomId);

    if (roomRows.length === 0) {
      res.status(400).json(`Room with id ${roomId} does not exist`);
      return;
    }

    const roomPhotoRows = await RoomPhoto.getOrderedPhotosForARoom(roomId);

    const roomDataObj = {
      roomObj: roomRows,
      roomPhotoObjList: roomPhotoRows,
    };

    res.status(200).json(roomDataObj);
  } catch (err) {
    return next(err);
  }
};

/*
creates a room for a listing by calling required model functions
*/
const createARoomByListingId = async (req, res, next) => {
  const listingId = req.params.id;
  const roomDataObj = req.body;
  //TO DO: validate room
  const roomObj = roomDataObj.roomObj;
  roomObj.listing_listing_id = listingId;
  const roomPhotoObjList = roomDataObj.roomPhotoObjList;
  try {
    const roomRows = await Room.createARoom(roomObj);
    const roomInsertId = roomRows.roomRows.insertId;

    const IdsOfRoomPhotosInserted = await RoomPhoto.createPhotosForARoom(
      roomInsertId,
      roomPhotoObjList
    );
    res
      .status(200)
      .json(
        `Room with id ${roomInsertId} created, ${IdsOfRoomPhotosInserted.length} photos inserted`
      );
  } catch (err) {
    next(err);
  }
};

/* update a rooms details by room id by using required model functions */
const updateARoomById = async (req, res, next) => {
  const roomObjWithRoomImageList = req.body;
  const roomObj = roomObjWithRoomImageList.roomObj;
  const roomPhotoObjList = roomObjWithRoomImageList.roomImageList;

  try {
    const newRoom = {
      room_description: roomObj.room_description,
      rent: roomObj.rent,
      deposit: roomObj.deposit,
      start_date: roomObj.start_date,
      end_date: roomObj.end_date,
      floor: roomObj.floor,
      is_desk: roomObj.is_desk,
      is_en_suite: roomObj.is_en_suite,
      is_boiler: roomObj.is_boiler,
      room_is_furnished: roomObj.room_is_furnished,
    };
    const roomQueryRows = await Room.updateARoomById(req.params.id, newRoom);

    const roomPhotoRows = await RoomPhoto.deleteRoomPhotosByRoomId(
      req.params.id
    );

    const roomPhotoInsertIdList = await RoomPhoto.createPhotosForARoom(
      req.params.id,
      roomPhotoObjList
    );

    res
      .status(200)
      .json(
        `Room with id ${req.params.id} updated. ${roomPhotoRows.affectedRows} photos deleted, ${roomPhotoInsertIdList.length} photos inserted`
      );
  } catch (err) {
    next(err);
  }
};

/*
delete a room by id by calling required model functions
*/
const deleteARoomById = async (req, res, next) => {
  const roomId = req.params.id;

  const roomPhotoRows = await RoomPhoto.deleteAPhotoByRoomId(roomId);
  const roomRows = await Room.deleteARoomById(roomId);

  console.log("roomPhotoQueryResult");
  console.log(roomPhotoRows);

  console.log("roomQueryResult");
  console.log(roomRows);

  try {
    res
      .status(200)
      .json(
        `Delete room with id ${roomId}, Deleted ${roomRows.affectedRows} room row, Deleted ${roomPhotoRows.affectedRows} photos for this room`
      );
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

/*
SAVED LISTINGS
*/

/*
return a list of listings, using a hardcoded user id from the saved table, by calling rqeuired model functions
*/
const getAllListingsByListingIds = async (req, res, next) => {
  try {
    //get the listings ids saved by the user
    const saveQueryRows = await SaveListing.getSavedListingIdsByUserId();

    const listingIdsSavedByUser = saveQueryRows.map((row) => {
      return row.listing_listing_id;
    });

    const listingRows = await Listing.getAllListingsByListingIds(
      listingIdsSavedByUser,
      req
    );

    const cardList = [];
    for (const listing of listingRows) {
      const listingPhotoRows = await ListingPhoto.getThumbnailForAListing(
        listing.listing_id
      );

      const listingPhotoRowsWithOnlyBlobData = listingPhotoRows.map(
        ({ listing_photo }) => {
          return { listing_photo };
        }
      );

      const roomCountQueryResult = await Room.getRoomCountForAListing(
        listing.listing_id
      );

      const roomCount = roomCountQueryResult[0][0].count;

      const minRoomRentForAListingQueryResult =
        await Room.getMinRoomRentForAListing(listing.listing_id);
      const minRoomRent = minRoomRentForAListingQueryResult[0][0].min_rent;

      const minRoomStartDateForAListingQueryResult =
        await Room.getMinRoomStartDateForAListing(listing.listing_id);
      const minRoomStartDate =
        minRoomStartDateForAListingQueryResult[0][0].min_start_date;

      const listingCard = {
        listing_id: listing.listing_id,
        title: listing.title,
        listingPhotoRows: listingPhotoRows,
        street_address: listing.street_address,
        city: listing.city,
        postcode: listing.postcode,
        listing_create_date: listing.listing_create_date,
        numRoomsAvailable: roomCount,
        minRoomRent: minRoomRent,
        earliestRoomDateAvailable: minRoomStartDate,
        hasLivingRoom: listing.has_living_room,
        hasHMO: listing.has_hmo,
        bathroomCount: listing.bathroom_count,
      };

      cardList.push(listingCard);
    }

    res.status(200).json(cardList);
  } catch (err) {
    return next(err);
  }
};

//returns all the listings ids of the listings saved by the user via the saved table
const getSavedListingIdsByUserId = async (req, res, next) => {
  try {
    const saveQueryResult = await SaveListing.getSavedListingIdsByUserId(req);

    res.status(200).json(saveQueryResult);
  } catch (err) {
    throw err;
  }
};

/* USER */
/*
returns all listings by user id by calling required model functions
*/
const getAllListingsByUserId = async (req, res, next) => {
  try {
    const cardList = [];
    const listingRows = await Listing.getAllListingsByUserId(req);

    for (const listing of listingRows) {
      const listingPhotoRows = await ListingPhoto.getThumbnailForAListing(
        listing.listing_id
      );

      const listingPhotoRowsWithOnlyBlobData = listingPhotoRows.map(
        ({ listing_photo }) => {
          return { listing_photo };
        }
      );

      const roomCountQueryResult = await Room.getRoomCountForAListing(
        listing.listing_id
      );

      const roomCount = roomCountQueryResult[0][0].count;

      const minRoomRentForAListingQueryResult =
        await Room.getMinRoomRentForAListing(listing.listing_id);
      const minRoomRent = minRoomRentForAListingQueryResult[0][0].min_rent;

      const minRoomStartDateForAListingQueryResult =
        await Room.getMinRoomStartDateForAListing(listing.listing_id);
      const minRoomStartDate =
        minRoomStartDateForAListingQueryResult[0][0].min_start_date;

      const listingCard = {
        listing_id: listing.listing_id,
        title: listing.title,
        listingPhotoRows: listingPhotoRows,
        street_address: listing.street_address,
        city: listing.city,
        postcode: listing.postcode,
        listing_create_date: listing.listing_create_date,
        numRoomsAvailable: roomCount,
        minRoomRent: minRoomRent,
        earliestRoomDateAvailable: minRoomStartDate,
        hasLivingRoom: listing.has_living_room,
        hasHMO: listing.has_hmo,
        bathroomCount: listing.bathroom_count,
      };

      cardList.push(listingCard);
    }

    res.status(200).json(cardList);
  } catch (err) {
    return next(err);
  }
};

/*
saves a listing for a user using a listing id and a user id by and creating a new row in the saved table
*/
const saveAListingForAUser = async (req, res, next) => {
  try {
    const saveQueryResult = await SaveListing.saveAListingByListingAndUserId(
      req
    );
    res.status(200).json(saveQueryResult);
  } catch (err) {
    throw err;
  }
};

/*
delete a saved listing for a user by deleting a row in the saved table
*/
const deleteAListingForAUser = async (req, res, next) => {
  try {
    const saveQueryResult =
      await SaveListing.deleteASavedListingByListingAndUserId(req);
    res.status(200).json(saveQueryResult);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  //Listings
  getAllListings,
  getAListingById,
  createAListing,
  updateAListingById,
  deleteAListingById,

  //Rooms
  getARoomsDetailsById,
  createARoomByListingId,
  deleteARoomById,
  updateARoomById,

  //Saved
  getAllListingsByListingIds,
  getSavedListingIdsByUserId,
  saveAListingForAUser,
  deleteAListingForAUser,

  //Users posted listings
  getAllListingsByUserId,
};
