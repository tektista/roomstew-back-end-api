/*
Description: the model for the room_photo table in the db, containing functions that query the room_photo table
*/

const pool = require("./db.js");

const RoomPhoto = function (roomPhoto) {
  this.room_photo = roomPhoto.room_photo;
  this.room_photo_order = roomPhoto.room_photo_order;
  this.room_photo_create_date = roomPhoto.room_photo_create_date;
  this.room_room_id = roomPhoto.room_room_id;
};

/*
return photos for a room by id from the db
*/
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

/*
return the photo ids for a room by id from the db
*/
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

/*
return all photos for a room by id from the db, ordered by room_photo_order
*/
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

/*
insert a room photo into the db
*/
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

//insert all photos for a given room ID into the db
RoomPhoto.createPhotosForARoom = async (roomInsertId, roomImageList) => {
  try {
    const IdsOfRoomPhotosInserted = [];

    for (let i = 0; i < roomImageList.length; i++) {
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

/*
delete a room photo by id from the db
*/
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

/*
delete all room photos by room id from the db
*/
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
