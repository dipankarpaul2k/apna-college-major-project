import mongoose from "mongoose";
const Schema = mongoose.Schema;
import Review from "./reviews.model.js";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

// Post middleware
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews.length) {
    const result = await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log(result);
  }
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
