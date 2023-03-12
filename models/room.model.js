const pool = require("./db.js");

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
};

/* all functions in this require a listing_id which is provided by 
the listing model
*/

Room.getRoomsForListing = async (id) => {
  try {
    const roomQueryResult = await pool.query(
      "SELECT * FROM room WHERE listing_listing_id = ?",
      [id]
    );
    return roomQueryResult;
  } catch (err) {
    return next(err);
  }
};

module.exports = Room;
