import Express from "express";
const router = Express.Router({ mergeParams: true });

// imports
import * as reviewController from "../controllers/review.controllers.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import validateReview from "../schema/review.schema.js";
import { isLoggedIn, isReviewAuthor } from "../middleware/middlewareFns.js";

// Add new review
router.post(
  "/",
  isLoggedIn(),
  validateReview,
  asyncErrorHandler(reviewController.addNewReview)
);

// Delete review
router.delete(
  "/:reviewId",
  isLoggedIn(),
  isReviewAuthor(),
  asyncErrorHandler(reviewController.deleteReview)
);

export default router;
