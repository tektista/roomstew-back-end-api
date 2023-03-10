const Joi = require("joi");

const listingSchema = Joi.object({
  postcode: Joi.string().min(1).max(10).required(),
  street_address: Joi.string().min(10).max(255).required(),
  city: Joi.string().min(1).max(50).required(),
  country: Joi.string().min(1).max(50).required(),

  building_type: Joi.number().integer().min(0).max(2).required(),
  bills_included: Joi.boolean().required(),
  internet_included: Joi.boolean().required(),
  is_furnished: Joi.boolean().required(),
  bathroom_count: Joi.number().integer().min(1).max(12).required(),
  has_hmo: Joi.boolean().required(),
  has_living_room: Joi.boolean().required(),
  has_garden: Joi.boolean().required(),
  has_parking: Joi.boolean().required(),

  min_age: Joi.number().integer().min(17).max(99).required(),
  max_age: Joi.number().integer().min(17).max(99).required(),
  gender_preference: Joi.number().integer().min(0).max(2).required(),
  couples_allowed: Joi.boolean().required(),
  smokers_allowed: Joi.boolean().required(),
  pets_allowed: Joi.boolean().required(),

  title: Joi.string().min(10).max(255).required(),
  description: Joi.string().min(10).max(512).required(),

  is_expired: Joi.boolean().required(),
  expiry_date: Joi.date().required(),
  listing_create_date: Joi.date().required(),
  listing_update_date: Joi.date().required(),
});

module.exports = {
  listingSchema,
};
