import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    // Listen for connection lost events
    mongoose.connection.once("disconnected", () => {
      console.log("DB disconnected");
    });
  } catch (error) {
    console.error("DB connection error:", error);
  }
};
