import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("URI:", process.env.MONGO_URI_LOCAL);
        await mongoose.connect(process.env.MONGO_URI_LOCAL);
        console.log("MongoDB connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default connectDB;
