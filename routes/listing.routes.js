import Express from "express";
const router = Express.Router();

// imports
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import validateListing from "../schema/listing.schema.js";
import * as listingController from "../controllers/listing.controllers.js";
import { isLoggedIn, isOwner } from "../middleware/middlewareFns.js";

// import multer and initialize
import multer from "multer";
import { storage, cloudinary } from "../cloudStorage/cloudinary.config.js";
const upload = multer({ storage: storage });

// Routes
// "/" Routes
router
  .route("/")
  // Get All listing Route
  .get(asyncErrorHandler(listingController.getAllListing))
  // Add New Listing Route
  .post(
    isLoggedIn(),
    upload.single("listing[image]"),
    // validateListing,
    asyncErrorHandler(listingController.addNewListing)
  );

// Get New Form Route
router.get("/new", isLoggedIn(), listingController.getNewForm);

// "/:id" Routes
router
  .route("/:id")
  // Show Listing Route
  .get(asyncErrorHandler(listingController.showListing))
  // Update Listing
  .put(
    isLoggedIn(),
    isOwner(),
    upload.single("listing[image]"),
    validateListing,
    asyncErrorHandler(listingController.updateListing)
  )
  // Delete Listing
  .delete(
    isLoggedIn(),
    isOwner(),
    asyncErrorHandler(listingController.deleteListing)
  );

// Edit Form Route
router.get(
  "/:id/edit",
  isLoggedIn(),
  isOwner(),
  asyncErrorHandler(listingController.getEditForm)
);

export default router;
