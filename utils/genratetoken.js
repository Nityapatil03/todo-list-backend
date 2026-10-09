import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

const genratetoken = (res, userId) => {
    const secret = process.env.JWT_SECRET || "nitya_jwt_secret_key_2026_fallback";
    const token = jwt.sign({ id: userId }, secret, {
        expiresIn: "30d" 
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return token;
}
export default genratetoken;
