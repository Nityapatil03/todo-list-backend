import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import tasksRoutes from "./routes/taskRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

connectDB();

app.use("/api/users",userRoutes);
app.use("/api/tasks",tasksRoutes);

const server = app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});

export default server;
 
