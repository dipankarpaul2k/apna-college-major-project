// validate the listing schema
import Joi from "joi";

const listingSchema = Joi.object({
  _method: Joi.string(),
  listing: Joi.object({
    title: Joi.string().required().max(50),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
  }).required(),
});

// Schema validation middleware function
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((elm) => elm.message).join(",");
    console.log(errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

export default validateListing;
