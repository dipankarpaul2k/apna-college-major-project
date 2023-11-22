import Listing from "../models/listings.model.js";
import Review from "../models/reviews.model.js";

// Add new review
export async function addNewReview(req, res) {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Created!");

  console.log("New review created and saved.");
  return res.redirect(`/listings/${listing._id}`);
}

// Delete a review
export async function deleteReview(req, res) {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");

  console.log("A review is deleted.");
  return res.redirect(`/listings/${id}`);
}
