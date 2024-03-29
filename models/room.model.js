/* 
Description: the model for the room table in the db, containing functions that query the room table
*/

const pool = require("./db.js");
const RoomPhoto = require("./room_photo.model.js");

const Room = function (room) {
  this.room_description = room.room_description;
  this.rent = room.rent;
  this.deposit = room.deposit;
  this.start_date = room.start_date;
  this.end_date = room.end_date;

  this.room_size = room.room_size;
  this.room_is_furnished = room.room_is_furnished;
  this.is_en_suite = room.is_en_suite;
  this.is_desk = room.is_desk;
  this.is_boiler = room.is_boiler;
  this.floor = room.floor;

  this.room_create_date = room.room_create_date;
  this.room_update_date = room.room_update_date;
  this.listing_listing_id = room.listing_listing_id;
};

/* 
return a room by id from the db
*/
Room.getARoomById = async (id) => {
  try {
    const roomQueryResult = await pool.query(
      "SELECT * FROM room WHERE room_id = ?",
      [id]
    );

    const roomRows = roomQueryResult[0];
    return roomRows;
  } catch (err) {
    throw err;
  }
};

/*
return rooms for a listing by listing id from the db
*/
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

/*
return all room ids for a listing by listing id from the db
*/
Room.getRoomIdsForAListing = async (id) => {
  try {
    const roomQueryResult = await pool.query(
      "SELECT room_id FROM room WHERE listing_listing_id = ?",
      [id]
    );

    const roomRows = roomQueryResult[0];
    return roomRows;
  } catch (err) {
    throw err;
  }
};

/*
return room details for a listing by listing id from the db
*/
Room.getRoomsCardDetailsForAListing = async (id) => {
  try {
    const roomQueryResult = await pool.query(
      "SELECT room_id, rent, deposit, is_en_suite, room_is_furnished, room_size, start_date FROM room WHERE listing_listing_id = ?",
      [id]
    );

    const roomRows = roomQueryResult[0];
    return roomRows;
  } catch (err) {
    throw err;
  }
};

/*
insert rooms for a listing by listing id into the db
*/
// listingRoomsWithRoomPhotos =
//[ {roomObj: {roomObj}, roomObjPhotoList: [{roomPhotoObj}...] }...]
Room.createRoomsForAListing = async (
  listingInsertId,
  listingRoomsWithRoomPhotos
) => {
  try {
    const roomRowList = [];
    const IdsOfRoomPhotosInserted = [];

    for (let i = 0; i < listingRoomsWithRoomPhotos.length; i++) {
      const newRoom = new Room({
        room_description:
          listingRoomsWithRoomPhotos[i].roomObj.room_description,
        rent: listingRoomsWithRoomPhotos[i].roomObj.rent,
        deposit: listingRoomsWithRoomPhotos[i].roomObj.deposit,
        start_date: listingRoomsWithRoomPhotos[i].roomObj.start_date,
        end_date: listingRoomsWithRoomPhotos[i].roomObj.end_date,

        room_size: listingRoomsWithRoomPhotos[i].roomObj.room_size,
        floor: listingRoomsWithRoomPhotos[i].roomObj.floor,
        room_is_furnished:
          listingRoomsWithRoomPhotos[i].roomObj.room_is_furnished,

        is_en_suite: listingRoomsWithRoomPhotos[i].roomObj.is_en_suite,
        is_desk: listingRoomsWithRoomPhotos[i].roomObj.is_desk,
        is_boiler: listingRoomsWithRoomPhotos[i].roomObj.is_boiler,

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

/*
insert a room into the db
*/
Room.createARoom = async (newRoom) => {
  try {
    const roomQueryResult = await pool.query("INSERT INTO room SET ?", [
      newRoom,
    ]);
    const roomRows = roomQueryResult[0];
    return { roomRows: roomRows, insertedRoom: newRoom };
  } catch (err) {
    throw err;
  }
};

/*
insert rooms for a listing by listing id into the db
*/
Room.createRoomsForAListing = async (
  listingInsertId,
  listingRoomsWithRoomPhotos
) => {
  try {
    const roomRowList = [];
    const IdsOfRoomPhotosInserted = [];

    for (let i = 0; i < listingRoomsWithRoomPhotos.length; i++) {
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

//return the number of rooms for a listing by listing id from the db
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

/*
return the min room rent for a listing by listing id from the db
*/
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

/*
return the min room start date for a listing by listing id from the db
*/
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

/*

*/
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
      is_en_suite: room.is_en_suite,
      room_is_furnished: room.room_is_furnished,
      room_size: room.room_size,
      start_date: room.start_date,
    }));
  } catch (err) {
    throw err;
  }
};

/*
delete a room by room id from the db
*/
Room.deleteARoomById = async (id) => {
  try {
    const roomQueryResult = await pool.query(
      "DELETE FROM room WHERE room_id = ?",
      [id]
    );

    return roomQueryResult[0];
  } catch (err) {
    throw err;
  }
};

/*
delete all rooms for a listing by listing id from the db
*/
Room.deleteRoomsByListingId = async (id) => {
  try {
    const roomQueryResult = await pool.query(
      "DELETE FROM room WHERE listing_listing_id = ?",
      [id]
    );

    return roomQueryResult[0];
  } catch (err) {
    throw err;
  }
};

/*
update a room by room id in the db
*/
Room.updateARoomById = async (id, room) => {
  try {
    const roomQueryResult = await pool.query(
      "UPDATE room SET ? WHERE room_id = ?",
      [room, id]
    );

    return roomQueryResult[0];
  } catch (err) {
    throw err;
  }
};

module.exports = Room;
