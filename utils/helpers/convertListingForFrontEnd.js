//This is a helper function to help convert the values from the listing of the database to the values that are displayed on the listing details screen. This is to help with the consistency of the data displayed on the listing details screen.

const convertListingForFrontEnd = (listingObj) => {
  const listing = { ...listingObj };

  listing.is_furnished == 1
    ? (listing.is_furnished = "Yes")
    : (listing.is_furnished = "No");

  listing.bills_included == 1
    ? (listing.bills_included = "Included")
    : (listing.bills_included = "Not included");

  listing.internet_included == 1
    ? (listing.internet_included = "Included")
    : (listing.internet_included = "Not included");

  listing.has_living_room == 1
    ? (listing.has_living_room = "Yes")
    : (listing.has_living_room = "No");

  listing.has_garden == 1
    ? (listing.had_garden = "Yes")
    : (listing.has_garden = "No");

  listing.has_parking == 1
    ? (listing.has_parking = "Yes")
    : (listing.has_parking = "No");

  listing.age_preference = `${listing.min_age} - ${listing.min_age}`;

  listing.couples_allowed == 1
    ? (listing.couples_allowed = "Allowed")
    : (listing.couples_allowed = "Not Allowed");

  listing.smokers_allowed == 1
    ? (listing.smokers_allowed = "Allowed")
    : (listing.smokers_allowed = "Not Allowed");

  listing.pets_allowed == 1
    ? (listing.pets_allowed = "Allowed")
    : (listing.pets_allowed = "Not Allowed");

  if (listing.building_type == 0) {
    listing.building_type = "Flat";
  }
  if (listing.building_type == 1) {
    listing.building_type = "House";
  }
  if (listing.building_type == 2) {
    listing.building_type = "Other";
  }

  if (listing.gender_preference == 0) {
    listing.gender_preference = "Female only";
  }
  if (listing.gender_preference == 1) {
    listing.gender_preference = "Male only";
  }
  if (listing.gender_preference == 2) {
    listing.gender_preference = "Any";
  }

  return listing;
};

module.exports = convertListingForFrontEnd;
