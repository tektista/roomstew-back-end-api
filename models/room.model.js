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
    return roomQueryResult;
  } catch (err) {
    throw err;
  }
};

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

Room.createARoom = async (newRoom) => {
  try {
    console.log(newRoom.listing_listing_id);

    const roomQueryResult = await pool.query("INSERT INTO room SET ?", [
      newRoom,
    ]);
    const roomRows = roomQueryResult[0];
    return roomRows;
  } catch (err) {
    throw err;
  }
};

Room.createRooms = async (listingInsertId, roomListWithPhotoList) => {
  try {
    for (let i = 0; i < roomListWithPhotoList.length; i++) {
      //TO DO: validate  photos

      console.log(listingInsertId);

      const newRoom = new Room({
        room_description: roomListWithPhotoList[i][0].room_description,
        rent: roomListWithPhotoList[i][0].rent,
        deposit: roomListWithPhotoList[i][0].deposit,
        start_date: roomListWithPhotoList[i][0].start_date,
        end_date: roomListWithPhotoList[i][0].end_date,

        room_size: roomListWithPhotoList[i][0].room_size,
        floor: roomListWithPhotoList[i][0].floor,
        room_is_furnished: roomListWithPhotoList[i][0].room_is_furnished,
        is_en_suite: roomListWithPhotoList[i][0].is_en_suite,
        is_desk: roomListWithPhotoList[i][0].is_desk,
        is_boiler: roomListWithPhotoList[i][0].is_boiler,

        room_create_date: new Date(),
        room_update_date: new Date(),

        listing_listing_id: listingInsertId,
      });

      const roomRows = await Room.createARoom(newRoom);
      const roomInsertId = roomRows.insertId;

      console.log(roomListWithPhotoList[i][1]);

      const roomPhotoRows = await RoomPhoto.createRoomPhotos(
        roomInsertId,
        roomListWithPhotoList[i][1]
      );
    }
    return roomListWithPhotoList;
  } catch (err) {
    throw err;
  }
};

module.exports = Room;
