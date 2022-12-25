const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().min(10).max(255).required(),
  description: Joi.string().min(10).max(512).required(),
  thumbnail: Joi.any(),
  email: Joi.string().email().required(),
  phone_num: Joi.string()
    .regex(/^\+44\s?\d{4}\s?\d{6}$/)
    .required(),
  rooms_available: Joi.number().integer().min(1).max(12).required(),
  is_furnished: Joi.boolean().required(),
  bathroom_count: Joi.number().integer().min(1).max(12).required(),
  bills_included: Joi.boolean().required(),
  street_address: Joi.string().min(10).max(255).required(),
  city: Joi.string().min(1).max(50).required(),
  postcode: Joi.string().min(1).max(10).required(),
  is_expired: Joi.boolean().required(),
  expiry_date: Joi.date().required(),
  listing_create_date: Joi.date().required(),
  listing_update_date: Joi.date().required(),
  min_age: Joi.number().integer().min(18).max(120).required(),
  max_age: Joi.number().integer().min(18).max(120).required(),
  gender_preference: Joi.number().integer().min(0).max(2).required(),
  couples_allowed: Joi.boolean().required(),
  smokers_allowed: Joi.boolean().required(),
  pets_allowed: Joi.boolean().required(),
});

module.exports = {
  listingSchema,
};
