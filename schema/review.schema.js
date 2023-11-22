// validate the listing schema
import Joi from "joi";

const reviewSchema = Joi.object({
  _method: Joi.string(),
  review: Joi.object({
    // title: Joi.string(),
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

// Schema validation middleware function
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // if error occurs
    let errMsg = error.details.map((elm) => elm.message).join(",");
    console.log(errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

export default validateReview;
