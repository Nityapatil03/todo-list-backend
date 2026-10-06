import express from "express"
import UserModel from "../models/usermodel.js";
import genratetoken from "../utils/genratetoken.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await UserModel.create({
            name,
            email,
            password
        });
        if (user) {
            genratetoken(res, user._id.toString());
            res.status(201).json({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
     
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }
    const user = await UserModel.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        genratetoken(res, user._id.toString());
        res.status(200).json({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
        });
    }
    else {
        res.status(401).json({ message: "Invalid email or password" });
    }
})

router.get('/profile', protect, async (req, res) => {
    const user = await UserModel.findById(req.user._id).select("-password");
    if (user) {
        res.status(200).json({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
        });
    }
    else {
        res.status(404).json({ message: "User not found" });
    }
})

router.put('/profile', protect, async (req, res) => {
    const { name, currentpassword, newpassword } = req.body;
    const user = await UserModel.findById(req.user._id);

    if (user) {
        genratetoken(res, user._id.toString());
        if (name) {
            user.name = name;
        }
        if (currentpassword && newpassword) {
            if (await user.matchPassword(currentpassword)) {
                user.password = newpassword;
            }
            else {
                return res.status(401).json({ message: "current password incorrect" })
            }
        }
        try {
            const updatedUser = await user.save();
            res.status(200).json({
                _id: updatedUser._id.toString(),
                name: updatedUser.name,
                email: updatedUser.email,
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" })
        }
    } else {
        res.status(404).json({ message: "User not found" });
    }
})

router.post('/logout', async (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ message: "Logged out successfully" });
})
export default router;