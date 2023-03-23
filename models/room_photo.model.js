const pool = require("./db.js");

const RoomPhoto = function (roomPhoto) {
  this.room_photo = roomPhoto.room_photo;
  this.room_photo_order = roomPhoto.room_photo_order;
  this.room_photo_create_date = roomPhoto.room_photo_create_date;
  this.room_room_id = roomPhoto.room_room_id;
};

/* all functions in this require a room_id which is provided by 
the room model
*/

//get all photos for a room
RoomPhoto.getPhotosForARoom = async (id) => {
  try {
    const roomPhotoQueryResult = await pool.query(
      "SELECT * FROM room_photo WHERE room_room_id = ?",
      [id]
    );
    const roomPhotoRows = roomPhotoQueryResult[0];
    return roomPhotoRows;
  } catch (err) {
    throw err;
  }
};

RoomPhoto.getPhotoIdsForARoom = async (id) => {
  try {
    const roomPhotoQueryResult = await pool.query(
      "SELECT room_photo_id FROM room_photo WHERE room_room_id = ?",
      [id]
    );
    const roomPhotoRows = roomPhotoQueryResult[0];
    return roomPhotoRows;
  } catch (err) {
    throw err;
  }
};

RoomPhoto.getOrderedPhotosForARoom = async (id) => {
  try {
    const roomPhotoQueryResult = await pool.query(
      "SELECT room_photo FROM room_photo WHERE room_room_id = ? ORDER BY room_photo_order ASC",
      [id]
    );
    const roomPhotoRows = roomPhotoQueryResult[0];
    return roomPhotoRows;
  } catch (err) {
    throw err;
  }
};

//create one room photo
RoomPhoto.createAPhotoForARoom = async (newRoomPhoto) => {
  try {
    const roomPhotoQueryResult = await pool.query(
      "INSERT INTO room_photo SET ?",
      [newRoomPhoto]
    );
    const roomPhotoRows = roomPhotoQueryResult[0];
    return roomPhotoRows;
  } catch (err) {
    throw err;
  }
};

/* 
    For each room image, create a new room photo obj
     with a room_room id pointing to the current room
     Then add this to the database
     */
//Insert all photos for a given room ID and image list
RoomPhoto.createPhotosForARoom = async (roomInsertId, roomImageList) => {
  try {
    const IdsOfRoomPhotosInserted = [];

    for (let i = 0; i < roomImageList.length; i++) {
      //TO DO: validate the room photos
      const newRoomPhoto = new RoomPhoto({
        room_photo: roomImageList[i].room_photo,
        room_photo_order: roomImageList[i].room_photo_order,
        room_photo_create_date: new Date(),
        room_room_id: roomInsertId,
      });

      const roomPhotoRows = await RoomPhoto.createAPhotoForARoom(newRoomPhoto);
      IdsOfRoomPhotosInserted.push(roomPhotoRows.insertId);
    }
    return IdsOfRoomPhotosInserted;
  } catch (err) {
    throw err;
  }
};

RoomPhoto.deleteAPhotoByRoomId = async (id) => {
  try {
    const roomPhotoQueryResult = await pool.query(
      "DELETE FROM room_photo WHERE room_room_id = ?",
      [id]
    );
    return roomPhotoQueryResult[0];
  } catch (err) {
    throw err;
  }
};

RoomPhoto.deleteRoomPhotosByRoomId = async (id) => {
  try {
    const roomPhotoQueryResult = await pool.query(
      "DELETE FROM room_photo WHERE room_room_id = ?",
      [id]
    );
    return roomPhotoQueryResult[0];
  } catch (err) {
    throw err;
  }
};

module.exports = RoomPhoto;
