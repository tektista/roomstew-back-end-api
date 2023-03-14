const pool = require("./db.js");
const RoomPhoto = require("./room_photo.model.js");

const Room = function (room) {
  this.room_description = room.room_description;
  this.rent = room.rent;
  this.deposit = room.deposit;
  this.start_date = room.start_date;
  this.end_date = room.end_date;

  this.room_size = room.room_size;
  this.floor = room.floor;
  this.is_furnished = room.is_furnished;
  this.is_en_suite = room.is_en_suite;
  this.is_desk = room.is_desk;
  this.is_boiler = room.is_boiler;

  this.room_create_date = room.room_create_date;
  this.room_update_date = room.room_update_date;
  this.listing_listing_id = room.listing_listing_id;
};

/* all functions in this require a listing_id which is provided by 
the listing model
*/

//validate inside here
Room.getRoomsForAListing = async (id) => {
  try {
    const roomQueryResult = await pool.query(
      "SELECT * FROM room WHERE listing_listing_id = ?",
      [id]
    );

    const roomRows = roomQueryResult[0];
    return roomRows;
  } catch (err) {
    throw err;
  }
};

Room.createARoom = async (newRoom) => {
  try {
    const roomQueryResult = await pool.query("INSERT INTO room SET ?", [
      newRoom,
    ]);
    const roomRows = roomQueryResult[0];
    return roomRows;
  } catch (err) {
    throw err;
  }
};

Room.createRoomsForAListing = async (
  listingInsertId,
  listingRoomsWithRoomPhotos
) => {
  try {
    const roomRowList = [];
    const IdsOfRoomPhotosInserted = [];

    for (let i = 0; i < listingRoomsWithRoomPhotos.length; i++) {
      //TO DO: validate  photos

      const newRoom = new Room({
        room_description: listingRoomsWithRoomPhotos[i][0].room_description,
        rent: listingRoomsWithRoomPhotos[i][0].rent,
        deposit: listingRoomsWithRoomPhotos[i][0].deposit,
        start_date: listingRoomsWithRoomPhotos[i][0].start_date,
        end_date: listingRoomsWithRoomPhotos[i][0].end_date,

        room_size: listingRoomsWithRoomPhotos[i][0].room_size,
        floor: listingRoomsWithRoomPhotos[i][0].floor,
        room_is_furnished: listingRoomsWithRoomPhotos[i][0].room_is_furnished,
        is_en_suite: listingRoomsWithRoomPhotos[i][0].is_en_suite,
        is_desk: listingRoomsWithRoomPhotos[i][0].is_desk,
        is_boiler: listingRoomsWithRoomPhotos[i][0].is_boiler,

        room_create_date: new Date(),
        room_update_date: new Date(),

        listing_listing_id: listingInsertId,
      });

      const roomRows = await Room.createARoom(newRoom);
      roomRowList.push(newRoom);
      const roomInsertId = roomRows.insertId;

      const IdsOfRoomPhotosInsertedTemp = await RoomPhoto.createPhotosForARoom(
        roomInsertId,
        listingRoomsWithRoomPhotos[i][1]
      );

      if (i === 0) {
        IdsOfRoomPhotosInserted.push(...IdsOfRoomPhotosInsertedTemp);
      }
    }
    return {
      roomRowList: roomRowList,
      IdsOfRoomPhotosInserted: IdsOfRoomPhotosInserted,
    };
  } catch (err) {
    throw err;
  }
};

//For use on the listings cards on
Room.getRoomCountForAListing = async (id) => {
  try {
    const roomCountQueryResult = await pool.query(
      "SELECT COUNT(*) AS count FROM room WHERE listing_listing_id = ?",
      [id]
    );

    return roomCountQueryResult;
  } catch (err) {
    throw err;
  }
};

Room.getMinRoomRentForAListing = async (id) => {
  try {
    const minRoomRentForAListingQueryResult = await pool.query(
      "SELECT MIN(rent) AS min_rent FROM room WHERE listing_listing_id = ?",
      [id]
    );
    return minRoomRentForAListingQueryResult;
  } catch (err) {
    throw err;
  }
};

Room.getMinRoomStartDateForAListing = async (id) => {
  try {
    const minStartDateQueryResult = await pool.query(
      "SELECT MIN(DATE(start_date)) AS min_start_date FROM room WHERE listing_listing_id = ?",
      [id]
    );
    return minStartDateQueryResult;
  } catch (err) {
    throw err;
  }
};

//For use on the Listings Details page, for the cards of rooms

Room.getRoomsCardInfoForAListing = async (id) => {
  try {
    const roomQueryResult = await pool.query(
      "SELECT * FROM room WHERE listing_listing_id = ?",
      [id]
    );

    const roomRows = roomQueryResult[0];
    const roomRowsCardDetails = roomRows.map((room) => ({
      room_id: room.room_id,
      rent: room.rent,
      deposit: room.deposit,
      room_size: room.room_size,
      start_date: room.start_date,
    }));
  } catch (err) {
    throw err;
  }
};

module.exports = Room;
