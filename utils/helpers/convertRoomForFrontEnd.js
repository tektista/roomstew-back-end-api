const convertRoomForFrontEnd = (room) => {
  const newRoom = room;

  if (newRoom.hasOwnProperty("is_furnished")) {
    newRoom.is_furnished == 1
      ? (newRoom.is_furnished = "Yes")
      : (newRoom.is_furnished = "No");
  }

  if (newRoom.hasOwnProperty("room_size")) {
    newRoom.room_size = newRoom.room_size === 0 ? "Single Room" : "Double Room";
  }

  return newRoom;
};

module.exports = convertRoomForFrontEnd;
