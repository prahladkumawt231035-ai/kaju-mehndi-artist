import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id, role) => {
    const secret = process.env.JWT_SECRET || "kaju5201314";
    return jwt.sign(
        { id, role },
        secret,
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );
};

// Cookie configuration
const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

// Common response helper
const sendToken = (user, statusCode, res) => {
    const token = generateToken(user._id, user.role);

    res.cookie("token", token, cookieOptions());

    res.status(statusCode).json({
        success: true,
        message: statusCode === 201
            ? "Account created successfully"
            : "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
        },
    });
};

// @desc    Register a new Customer or Academy Student
// @route   POST /api/v1/auth/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account already exists with this email address",
            });
        }

        // Only allow "student" or "customer" from public registration
        // Admin accounts must never be registered publicly
        const userRole = (role || "").toLowerCase() === "student" ? "student" : "customer";

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: (phone || "").trim(),
            password,
            role: userRole,
        });

        sendToken(user, 201, res);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Authenticate User (Admin, Customer, Student)
// @route   POST /api/v1/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Please contact support.",
            });
        }

        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get Current Logged-in User
// @route   GET /api/v1/auth/me
export const getCurrentUser = async (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role,
            avatar: req.user.avatar,
        },
    });
};

// @desc    Logout User
// @route   POST /api/v1/auth/logout
export const logoutUser = async (req, res) => {
    res.clearCookie("token", cookieOptions());

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
