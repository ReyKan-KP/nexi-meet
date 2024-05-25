//utils/database.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    console.log("Already connected to MongoDB");
    return;
  }

  try {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: "nexi-meet",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
