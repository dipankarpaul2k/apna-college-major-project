import mongoose from "mongoose";
import sampleListings from "./data.js";
import Listing from "../models/listings.model.js";

// Function to connect with mongoDB database
async function connectMongo() {
  try {
    await mongoose
      .connect("mongodb://127.0.0.1:27017/wanderlust", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB database.");
      });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
}

connectMongo();

async function initDB() {
  await Listing.deleteMany({});
  let sampleListingsData = sampleListings.map((obj) => ({
    ...obj,
    owner: "654dd5e75e818b78c971c745",
  }));
  await Listing.insertMany(sampleListingsData);
  console.log("Data initialized.");
}

initDB();
