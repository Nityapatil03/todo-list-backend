import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import tasksRoutes from "./routes/taskRoutes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 6000;

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    process.env.FrontendUrl,
].filter(Boolean).map(url => url.replace(/\/+$/, "").replace(/\/login$/, ""));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app")
        ) {
            return callback(null, true);
        }
        return callback(null, true); // Permissive fallback to prevent CORS blocks during testing
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ToDo backend is running successfully!"
    });
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", tasksRoutes);

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`server is running on port ${PORT}`);
});

export default server;
 
