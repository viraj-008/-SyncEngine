
import mongoose from "mongoose";

export const connectDB = async () => {
 
  console.log(process.env.DB_String);
  console.log(process.env.REDIS_HOST,process.env.REDIS_PORT,process.env.REDIS_PASSWORD,'db ');
  try {
    process.env.DB_String 
    await mongoose.connect(process.env.DB_String,  {
      family: 4, // Force IPv4 for Docker
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
}