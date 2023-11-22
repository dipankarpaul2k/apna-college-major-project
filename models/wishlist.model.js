import mongoose from "mongoose";
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  listingId: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
