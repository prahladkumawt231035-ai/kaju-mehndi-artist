import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
} from "../controllers/authController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getCurrentUser);

// @desc    Get users by role (Admin only)
// @route   GET /api/v1/auth/users?role=student
router.get("/users", protect, authorize("admin"), async (req, res) => {
    try {
        const filter = {};
        if (req.query.role) filter.role = req.query.role;
        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
