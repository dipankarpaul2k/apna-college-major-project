import Listing from "../models/listings.model.js";
import User from "../models/user.model.js";
import Wishlist from "../models/wishlist.model.js";
import { geocodeAddress } from "../utils/geocodeAddress.js";

// Get all listing
export async function getAllListing(req, res) {
  const allListings = await Listing.find();
  return res.render("listings/index", { allListings });
}

// Get a form to create new listing
export function getNewForm(req, res) {
  return res.render("listings/new");
}

// Show a single listing
export async function showListing(req, res) {
  const id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  // console.log(listing);
  return res.render("listings/show", { listing });
  // throw new Error("Error occured!");
}

// Get a form to edit a listing
export async function getEditForm(req, res) {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_300");
  return res.render("listings/edit", { listing, originalImageUrl });
}

// Post a new listing
export async function addNewListing(req, res) {
  let url = req.file.path;
  let filename = req.file.filename;
  const { location, country } = req.body.listing;
  const address = `${location}, ${country}`;

  const geometry = await geocodeAddress(address);
  // console.log(geometry);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image.url = url;
  newListing.image.filename = filename;
  newListing.geometry = geometry;

  const savedlisting = await newListing.save();
  console.log(savedlisting);

  req.flash("success", "New Listing Created!");
  return res.redirect("/listings");
  // throw new Error("Error occured!");
}

// Update a existing listing
export async function updateListing(req, res) {
  const id = req.params.id;
  const updatedListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image.url = url;
    updatedListing.image.filename = filename;
    await updatedListing.save();
  }

  return res.redirect("/listings");
}

// Delete a existing listing
// export async function deleteListing(req, res) {
//   const id = req.params.id;
//   await Listing.findByIdAndDelete(id);
//   req.flash("success", "Listing Deleted!");
//   return res.redirect("/listings");
// }

export async function deleteListing(req, res) {
  // Extract the id of the listing
  const id = req.params.id;

  // Find the deleted listing
  const deletedListing = await Listing.findByIdAndDelete(id);

  // Check if the listing was found and deleted
  if (deletedListing) {
    // Step 1: Find wishlists containing the deleted product
    const wishlists = await Wishlist.find({ listingId: id });

    // Step 2: Remove the product from wishlists
    await Promise.all(
      wishlists.map(async (wishlist) => {
        await Wishlist.findByIdAndDelete(wishlist._id);
      })
    );

    // Step 3: Update the user's wishlist array
    const usersToUpdate = await User.find({
      wishlist: { $in: wishlists.map((wishlist) => wishlist._id) },
    });

    await Promise.all(
      usersToUpdate.map(async (user) => {
        // Remove the wishlist document IDs from the user's wishlist array
        user.wishlist = user.wishlist.filter(
          (wishlistId) =>
            !wishlists.some((wishlist) => wishlist._id.equals(wishlistId))
        );
        await user.save();
      })
    );
  }

  // Show the success massage
  req.flash("success", "Listing Deleted!");
  return res.redirect("/listings");
}
