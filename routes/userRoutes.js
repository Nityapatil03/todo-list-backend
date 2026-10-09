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
        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await UserModel.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await UserModel.create({
            name: name.trim(),
            email: normalizedEmail,
            password
        });
        if (user) {
            const token = genratetoken(res, user._id.toString());
            res.status(201).json({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                token
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});



router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            console.log(`❌ Login failed: No user found with email "${email}"`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            console.log(`❌ Login failed: Password incorrect for "${email}"`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Success
        const token = genratetoken(res, user._id.toString());
        res.status(200).json({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});


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

router.put(['/profile', '/updateProfile'], protect, async (req, res) => {
    const { name } = req.body;
    const currentpassword = req.body.currentpassword || req.body.currentPassword;
    const newpassword = req.body.newpassword || req.body.newPassword;
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
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.status(200).json({ message: "Logged out successfully" });
})
export default router;