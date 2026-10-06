import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

const protect = async (req,res,next) => {
    let token;

    // First check if token exists in cookies
    token = req.cookies.jwt;

    // If not in cookies, check Bearer token in headers
    if(!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Must use decoded.id because genratetoken signs { id: userId }
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401).json({message:"Not authorized, token failed"});
        }
    } else {
        res.status(401).json({message:"Not authorized, no token"});
    }
};  
export {protect};