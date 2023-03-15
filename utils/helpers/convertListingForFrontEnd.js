//This is a helper function to help convert the values from the listing of the database to the values that are displayed on the listing details screen. This is to help with the consistency of the data displayed on the listing details screen.

const convertListingForFrontEnd = (listingObj) => {
  const newListing = listingObj;

  newListing.is_furnished == 1
    ? (newListing.is_furnished = "Yes")
    : (newListing.is_furnished = "No");

  newListing.bills_included == 1
    ? (newListing.bills_included = "Included")
    : (newListing.bills_included = "Not included");

  newListing.internet_included == 1
    ? (newListing.internet_included = "Included")
    : (newListing.internet_included = "Not included");

  newListing.has_living_room == 1
    ? (newListing.has_living_room = "Yes")
    : (newListing.has_living_room = "No");

  newListing.has_garden == 1
    ? (newListing.had_garden = "Yes")
    : (newListing.has_garden = "No");

  newListing.has_parking == 1
    ? (newListing.has_parking = "Yes")
    : (newListing.has_parking = "No");

  newListing.couples_allowed == 1
    ? (newListing.couples_allowed = "Allowed")
    : (newListing.couples_allowed = "Not Allowed");

  newListing.smokers_allowed == 1
    ? (newListing.smokers_allowed = "Allowed")
    : (newListing.smokers_allowed = "Not Allowed");

  newListing.pets_allowed == 1
    ? (newListing.pets_allowed = "Allowed")
    : (newListing.pets_allowed = "Not Allowed");

  if (newListing.building_type == 0) {
    newListing.building_type = "Flat";
  }
  if (newListing.building_type == 1) {
    newListing.building_type = "House";
  }
  if (newListing.building_type == 2) {
    newListing.building_type = "Other";
  }

  if (newListing.gender_preference == 0) {
    newListing.gender_preference = "Female only";
  }
  if (newListing.gender_preference == 1) {
    newListing.gender_preference = "Male only";
  }
  if (newListing.gender_preference == 2) {
    newListing.gender_preference = "Any";
  }

  if (newListing.hasOwnProperty("age_preference")) {
    newListing.age_preference = `${newListing.min_age} - ${newListing.max_age}`;
  }

  // Card Listings
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

module.exports = convertListingForFrontEnd;
