const pool = require("../models/db");
const convertListingCardForFrontEnd = require("../utils/helpers/convertListingCardForFrontEnd");

const Listing = require("../models/listing.model");
const ListingPhoto = require("../models/listing_photo.model");
const Room = require("../models/room.model");
const RoomPhoto = require("../models/room_photo.model");
const SaveListing = require("../models/save_listing.model");

const { listingSchema } = require("../schemas/listing.schema");

//req is from the request when the route is called, res is the response
//we send back to the client calling the route

//LISTINGS TABLE
const getAllListings = async (req, res, next) => {
  try {
    const cardList = [];
    const listingRows = await Listing.getAllListings(req);

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
        id: listing.listing_id,
        title: listing.title,
        listingPhoto: listingPhotoRowsWithOnlyBlobData,
        streetAddress: listing.street_address,
        city: listing.city,
        postcode: listing.postcode,
        dateAdded: listing.listing_create_date,
        numRoomsAvailable: roomCount,
        minRoomRent: minRoomRent,
        earliestRoomDateAvailable: minRoomStartDate,
        dateAdded: listing.listing_create_date,
        // saved: listingIdsSavedByUser.includes(listing.listing_id)
        //   ? true
        //   : false,
      };

      const convertedListingCard = convertListingCardForFrontEnd(listingCard);
      cardList.push(convertedListingCard);
    }

    res.status(200).json(cardList);
  } catch (err) {
    return next(err);
  }
};

//Get all saved listings given a user id
const getAllListingsByListingIds = async (req, res, next) => {
  try {
    //hardcoded user id
    const saveQueryRows = await SaveListing.getSavedListingIdsByUserId();

    const listingIdsSavedByUser = saveQueryRows.map((row) => {
      return row.listing_listing_id;
    });

    //pass offset/query
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
        id: listing.listing_id,
        title: listing.title,
        listingPhoto: listingPhotoRowsWithOnlyBlobData,
        streetAddress: listing.street_address,
        city: listing.city,
        postcode: listing.postcode,
        dateAdded: listing.listing_create_date,
        numRoomsAvailable: roomCount,
        minRoomRent: minRoomRent,
        earliestRoomDateAvailable: minRoomStartDate,
        dateAdded: listing.listing_create_date,
        // saved: listingIdsSavedByUser.includes(listing.listing_id)
        //   ? true
        //   : false,
      };

      const convertedListingCard = convertListingCardForFrontEnd(listingCard);

      cardList.push(convertedListingCard);
    }

    res.status(200).json(cardList);
  } catch (err) {
    throw err;
  }
};

//get all the listings the user has posetd given a user id
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
        id: listing.listing_id,
        title: listing.title,
        listingPhoto: listingPhotoRowsWithOnlyBlobData,
        streetAddress: listing.street_address,
        city: listing.city,
        postcode: listing.postcode,
        dateAdded: listing.listing_create_date,
        numRoomsAvailable: roomCount,
        minRoomRent: minRoomRent,
        earliestRoomDateAvailable: minRoomStartDate,
        dateAdded: listing.listing_create_date,
      };

      const convertedListingCard = convertListingCardForFrontEnd(listingCard);
      cardList.push(convertedListingCard);
    }

    res.status(200).json(cardList);
  } catch (err) {
    throw err;
  }
};

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

const createAListing = async (req, res, next) => {
  try {
    // [{listingObj: {listingObj}, listingPhotoObjList: [{listingPhotoObj}...], listingRoomObjList: [{roomObj}...]
    const listing = req.body.listingObj;
    const listingPhotos = req.body.listingPhotoObjList;
    const listingRoomsAndRoomPhotosObjList =
      req.body.listingRoomsAndRoomPhotosObjList;

    //TO DO: validate Listing Photos, Rooms and Room Photos
    const { error, value } = listingSchema.validate(listing);

    const newListing = new Listing({
      postcode: listing.postcode,
      street_address: listing.street_address,
      city: listing.city,
      // country: listing.country,
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
    //For each  obj in the list:  [ {roomObj: {roomObj}, roomObjPhotoList: [{roomPhotoObj}...] }...]
    for (const roomDataObj of listingRoomsAndRoomPhotosObjList) {
      //Set the listing id of the room to the insert id of the listing
      roomDataObj.roomObj.listing_listing_id = listingInsertId;

      const roomInsertData = await Room.createARoom(roomDataObj.roomObj);
      const roomInsertId = roomInsertData.roomRows.insertId;
      const roomPhotoObjList = roomDataObj.roomPhotoObjList;

      //Insert the photos for the room, using the insert Id of the room
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

const putAListingById = (req, res, next) => {
  try {
    const { error, value } = listingSchema.validate(req.body);

    if (error) {
      throw error;
    }

    const result = Listing.updateAListingById(req.params.id, req.body);

    if (result.affectedRows === 0) {
      res.status(400).json(`Listing with id ${req.params.id} does not exist`);
      return;
    }

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

//ROOMS TABLE
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

//SAVED TABLE

// return all rows where

const getSavedListingIdsByUserId = async (req, res, next) => {
  try {
    const saveQueryResult = await SaveListing.getSavedListingIdsByUserId(req);

    res.status(200).json(saveQueryResult);
  } catch (err) {
    throw err;
  }
};

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
  getAllListings,
  getAllListingsByListingIds,
  getAListingById,
  createAListing,
  putAListingById,
  deleteAListingById,

  //
  getAllListingsByUserId,
  //
  getARoomsDetailsById,
  //
  getSavedListingIdsByUserId,
  saveAListingForAUser,
  deleteAListingForAUser,
};
