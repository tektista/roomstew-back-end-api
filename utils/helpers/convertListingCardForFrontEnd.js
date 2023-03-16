//This is a helper function to help convert the values from the listing of the database to the values that are displayed on the listing details screen. This is to help with the consistency of the data displayed on the listing details screen.

const convertListingCardForFrontEnd = (listingObj) => {
  const newListing = listingObj;

  if (newListing.hasOwnProperty("earliestRoomDateAvailable")) {
    const currentDate = new Date();
    const earliestDate = new Date(newListing.earliestRoomDateAvailable);

    if (earliestDate <= currentDate) {
      newListing.earliestRoomDateAvailable = "Now";
    }
  }

  if (newListing.hasOwnProperty("dateAdded")) {
    newListing.dateAdded = newListing.dateAdded.toLocaleDateString();
  }

  return newListing;
};

module.exports = convertListingCardForFrontEnd;
