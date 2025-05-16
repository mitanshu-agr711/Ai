import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // console.log("Connecting to MongoDB...",process.env.MONGO_URL);
    const conn = await mongoose.connect(process.env.MONGO_URL as string);
    console.log(`MongoDB Connected: successfully`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};