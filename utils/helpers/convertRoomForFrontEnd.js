const convertRoomForFrontEnd = (roomObj) => {
  const room = { ...roomObj };

  if (room.hasOwnProperty("is_furnished")) {
    room.is_furnished == 1
      ? (room.is_furnished = "Yes")
      : (room.is_furnished = "No");
  }

  if (room.hasOwnProperty("room_size")) {
    room.room_size = room.room_size === 0 ? "Single Room" : "Double Room";
  }

  //Room Card

  return room;
};

module.exports = convertRoomForFrontEnd;
