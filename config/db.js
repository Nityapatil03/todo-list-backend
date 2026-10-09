import mongoose from "mongoose";

let dbConnectionError = null;

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/ToDo";
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        dbConnectionError = null;
        console.log("MongoDB connected successfully");
    } catch (error) {
        dbConnectionError = error.message;
        console.error("MongoDB connection error:", error.message);
        // Do not call process.exit(1) so Express stays alive and can report health status
    }
};

export { dbConnectionError };
export default connectDB;
