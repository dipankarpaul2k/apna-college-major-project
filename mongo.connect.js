import mongoose from "mongoose";

export async function connectMongo() {
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
