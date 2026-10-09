import mongoose from "mongoose";

let dbConnectionError = null;

const connectDB = async () => {
    try {
        const ATLAS_URI = "mongodb+srv://nityaspatil06_db_users:Nitya1234@todo.fp8yt3t.mongodb.net/ToDo?appName=ToDo";
        const isCloud = process.env.RENDER || process.env.NODE_ENV === "production";
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI || (isCloud ? ATLAS_URI : "mongodb://127.0.0.1:27017/ToDo");
        console.log(`Connecting to MongoDB (${isCloud ? "Cloud Atlas" : "Local/Env"})...`);
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
