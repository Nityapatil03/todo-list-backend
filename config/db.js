import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/ToDo";
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
