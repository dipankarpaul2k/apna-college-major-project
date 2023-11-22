import Express from "express";
const router = Express.Router();

// Import functions
import * as wishlistController from "../controllers/wishlist.controllers.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { isLoggedIn } from "../middleware/middlewareFns.js";

// Routes
// Add new listing to wishlist
router.post(
  "/",
  isLoggedIn(),
  asyncErrorHandler(wishlistController.addToWishlist)
);

// Get all wishlisted listing
router.get(
  "/",
  isLoggedIn(),
  asyncErrorHandler(wishlistController.getAllWishlistItem)
);

// Delete listing from wishlist
router.delete(
  "/:id",
  isLoggedIn(),
  asyncErrorHandler(wishlistController.delWishlistItem)
);

// Export the router
export default router;
