import Express from "express";
const router = Express.Router();

// Import functions
import Listing from "../models/listings.model.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { isLoggedIn } from "../middleware/middlewareFns.js";

// Search route
router.post(
  "/listings/search",
  asyncErrorHandler(async (req, res) => {
    const { searchInput } = req.body;
    

    // Use a Mongoose query to search across both location and country
    const results = await Listing.find({
      $or: [
        { location: { $regex: searchInput, $options: "i" } }, // Case-insensitive search
        { country: { $regex: searchInput, $options: "i" } },
      ],
    });

    if (results && results.length > 0) {
      return res.render("listings/index", {
        allListings: results,
        search: searchInput,
      });
    }
    req.flash("error", `Sorry! No listing found for ${searchInput}`);
    return res.redirect("/listings");
  })
);

// Export the router
export default router;
