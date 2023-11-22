import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    comment: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // To autometially add createdAt and updatedAt
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
