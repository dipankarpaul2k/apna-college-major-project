// Imports models
import Wishlist from "../models/wishlist.model.js";
import User from "../models/user.model.js";

// Function to add new listing to wishlist
export async function addToWishlist(req, res) {
  const listingId = req.body.listingId;
  const userId = req.user._id;
  // console.log("listingId: ", listingId);
  // console.log("userId: ", userId);
  // return res.send("Working.");

  // Find the user
  const user = await User.findById(userId);

  // Check if the listing is already in the wishlist
  const existingWishlistItem = await Wishlist.findOne({ userId, listingId });

  if (existingWishlistItem) {
    req.flash("error", "Listing is already exist in the wishlist!");
    // Redirect back to the referring page
    let redirectUrl = req.header("Referer") || "/listings";
    return res.redirect(redirectUrl);
  }

  // Add the product to the wishlist
  const newWishlistItem = new Wishlist({ userId, listingId });
  user.wishlist.push(newWishlistItem);

  await newWishlistItem.save();
  await user.save();
  // await Wishlist.create({ userId, listingId });
  req.flash("success", "New item added to wishlist!");

  // Redirect back to the referring page
  let redirectUrl = req.header("Referer") || "/listings";
  return res.redirect(redirectUrl);
}

// Function to get all wishlisted listing
export async function getAllWishlistItem(req, res) {
  const userId = req.user._id;

  // Find the user
  const user = await User.findById(userId).populate({
    path: "wishlist",
    populate: { path: "listingId" },
  });
  // console.log(user);

  const wishlist = user.wishlist;
  console.log(wishlist);

  if (!user) {
    req.flash("error", "User does not exist!");
    return res.redirect("/listings");
  }
  // console.log(listing);
  return res.render("listings/wishlist", { wishlist });
  // return res.send(wishlist);
}

// Function to delete listing from wishlist
export async function delWishlistItem(req, res) {
  const wishlistId = req.params.id;
  const userId = req.user._id;

  await User.findByIdAndUpdate(userId, { $pull: { wishlist: wishlistId } });
  await Wishlist.findByIdAndDelete(wishlistId);

  req.flash("success", "Item deleted from wishlist!");

  console.log("An item deleted from wishlist!");
  return res.redirect("/wishlist");
}
