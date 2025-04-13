import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === "test" ? process.env.MONGO_TEST_DB : process.env.MONGO_DB;

    const connect = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${connect.connection.host}`);
    return connect;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDB;
